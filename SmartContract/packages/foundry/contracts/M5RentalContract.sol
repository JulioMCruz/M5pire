// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract M5RentalContract {
    uint256 public itemId;
    address public ownerAddress;
    address public renterAddress;
    uint256 public rentPricePerHour;
    uint256 public collateralAmount;
    uint256 public startTime;
    uint256 public endTime;
    bool public isRented;
    bool public isReturned;

    address public factoryOwner; // Wallet to receive fees
    uint256 public rentFeeMilliPercent; // Rent fee in thousandths of a percent (e.g., 250 for 2.5%)
    uint256 public collateralFeeMilliPercent; // Collateral fee in thousandths of a percent (e.g., 5 for 0.05%)

    // Events for tracking
    event ItemRented(
        uint256 indexed itemId,
        address indexed owner,
        address indexed renter,
        uint256 collateralAmount,
        uint256 startTime,
        uint256 endTime
    );
    event ItemReturned(uint256 indexed itemId, address indexed renter, uint256 timestamp);
    event CollateralReleased(uint256 indexed itemId, address indexed renter, uint256 timestamp);
    event PaymentReleased(uint256 indexed itemId, address indexed owner, uint256 rentPrice, uint256 timestamp);
    event FeesPaid(address indexed factoryOwner, uint256 rentFee, uint256 collateralFee);
    event ItemAvailable(uint256 indexed itemId, address indexed owner, uint256 timestamp);

    constructor(
        uint256 _itemId,
        address _ownerAddress,
        uint256 _rentPricePerHour,
        uint256 _collateralAmount,
        address _factoryOwner,
        uint256 _rentFeeMilliPercent,
        uint256 _collateralFeeMilliPercent
    ) {
        itemId = _itemId;
        ownerAddress = _ownerAddress;
        rentPricePerHour = _rentPricePerHour;
        collateralAmount = _collateralAmount;
        factoryOwner = _factoryOwner;
        rentFeeMilliPercent = _rentFeeMilliPercent;
        collateralFeeMilliPercent = _collateralFeeMilliPercent;
        isRented = false;
        isReturned = false;
    }

    modifier onlyRenter() {
        require(msg.sender == renterAddress, "Only the renter can perform this action");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Only the owner can perform this action");
        _;
    }

    modifier isRentedItem() {
        require(isRented, "Item is not currently rented");
        _;
    }

    // Function to rent the item with collateral deposit and rental period definition
    function rentItem(uint256 _startTime, uint256 _endTime) external payable {
        require(!isRented, "Item is already rented");
        require(msg.value == collateralAmount, "Incorrect collateral amount");
        require(_startTime >= block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");

        renterAddress = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
        isRented = true;
        isReturned = false;

        emit ItemRented(
            itemId,
            ownerAddress,
            renterAddress,
            collateralAmount,
            startTime,
            endTime
        );
    }

    // Function to calculate total rent price based on rental period
    function calculateRentPrice(uint256 _startTime, uint256 _endTime) public view returns (uint256) {
        require(_endTime > _startTime, "End time must be after start time");
        
        uint256 rentalDurationInHours = (_endTime - _startTime) / 1 hours;
        return rentalDurationInHours * rentPricePerHour;
    }

    // Function to return the item, pay the rent, and release the collateral
    function returnItem() external payable onlyRenter isRentedItem {
        require(!isReturned, "Item has already been returned");
        require(block.timestamp <= endTime, "Return period has expired");

        uint256 totalRentPrice = calculateRentPrice(startTime, endTime);
        require(msg.value == totalRentPrice, "Incorrect rent amount");

        isReturned = true;

        // Calculate and transfer the rent fee (in thousandths of a percent)
        uint256 rentFee = (totalRentPrice * rentFeeMilliPercent) / 1000;
        uint256 amountAfterFee = totalRentPrice - rentFee;

        // Pay the owner, deducting the fee
        payable(ownerAddress).transfer(amountAfterFee);
        payable(factoryOwner).transfer(rentFee);

        emit PaymentReleased(itemId, ownerAddress, totalRentPrice, block.timestamp);
        emit FeesPaid(factoryOwner, rentFee, 0);

        // Release the collateral
        payable(renterAddress).transfer(collateralAmount);

        emit CollateralReleased(itemId, renterAddress, block.timestamp);

        // Mark item as available for rent again
        isRented = false;
        renterAddress = address(0);  // Clear renter

        emit ItemAvailable(itemId, ownerAddress, block.timestamp);

        emit ItemReturned(itemId, renterAddress, block.timestamp);
    }

    // Function to release collateral automatically and apply a collateral fee
    function releaseCollateralIfNoDispute() external isRentedItem {
        require(block.timestamp > endTime, "Return period has not expired yet");
        require(!isReturned, "Item has already been returned");

        // Calculate collateral fee (in thousandths of a percent)
        uint256 collateralFee = (collateralAmount * collateralFeeMilliPercent) / 100000;
        uint256 amountAfterFee = collateralAmount - collateralFee;

        // Transfer the remaining collateral to the renter, deducting the fee
        payable(renterAddress).transfer(amountAfterFee);
        payable(factoryOwner).transfer(collateralFee);

        emit CollateralReleased(itemId, renterAddress, block.timestamp);
        emit FeesPaid(factoryOwner, 0, collateralFee);

        // Mark item as available for rent again
        isRented = false;
        renterAddress = address(0);  // Clear renter

        emit ItemAvailable(itemId, ownerAddress, block.timestamp);
    }

    // Function to estimate the rental cost and required collateral
    function estimateRentalCost(uint256 _startTime, uint256 _endTime) public view returns (uint256, uint256) {
        require(_startTime >= block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        
        uint256 estimatedRentPrice = calculateRentPrice(_startTime, _endTime);
        uint256 requiredCollateral = collateralAmount;

        return (estimatedRentPrice, requiredCollateral);
    }

    // Function to retrieve item details
    function getItemDetails() external view returns (
        uint256, address, address, uint256, uint256, uint256, uint256, bool, bool
    ) {
        return (itemId, ownerAddress, renterAddress, rentPricePerHour, collateralAmount, startTime, endTime, isRented, isReturned);
    }
}
