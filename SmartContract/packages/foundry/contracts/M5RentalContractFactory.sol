// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./M5RentalContract.sol";

contract M5RentalContractFactory {
    uint256 public itemIdCounter; // Counter for itemIds
    address public factoryOwner; // Wallet to receive fees
    uint256 public rentFeeMilliPercent = 500; // Rent fee in thousandths of a percent (5%)
    uint256 public collateralFeeMilliPercent = 5; // Collateral fee in thousandths of a percent (0.05%)

    address[] public rentalContracts; // List of created rental contracts

    // Events for contract creation and configuration updates
    event RentalContractCreated(
        address indexed rentalContractAddress,
        uint256 indexed itemId,
        address indexed owner,
        uint256 rentPricePerHour,
        uint256 collateralAmount
    );
    
    event FactorySettingsUpdated(
        address indexed newOwnerWallet,
        uint256 newRentFeeMilliPercent,
        uint256 newCollateralFeeMilliPercent
    );

    constructor() {
        factoryOwner = msg.sender; // Initialize the factory wallet as the contract creator
        itemIdCounter = 0; // Initialize the counter
    }

    // Function to create a new rental contract for an item
    function createRentalContract(
        uint256 _rentPricePerHour,
        uint256 _collateralAmount
    ) external returns (address) {
        itemIdCounter++; // Increment the item ID

        // Create a new rental contract
        M5RentalContract newRentalContract = new M5RentalContract(
            itemIdCounter,
            msg.sender,
            _rentPricePerHour,
            _collateralAmount,
            factoryOwner,
            rentFeeMilliPercent,
            collateralFeeMilliPercent
        );

        // Store the address of the created contract
        rentalContracts.push(address(newRentalContract));

        // Emit an event for contract creation
        emit RentalContractCreated(
            address(newRentalContract),
            itemIdCounter,
            msg.sender,
            _rentPricePerHour,
            _collateralAmount
        );

        return address(newRentalContract);
    }

    // Function to update the factory wallet and fees
    function updateFactorySettings(address _newOwnerWallet, uint256 _newRentFeeMilliPercent, uint256 _newCollateralFeeMilliPercent) external {
        require(msg.sender == factoryOwner, "Only the factory owner can update settings");
        require(_newRentFeeMilliPercent <= 10000, "Rent fee cannot exceed 100%");
        require(_newCollateralFeeMilliPercent <= 10000, "Collateral fee cannot exceed 100%");

        factoryOwner = _newOwnerWallet;
        rentFeeMilliPercent = _newRentFeeMilliPercent;
        collateralFeeMilliPercent = _newCollateralFeeMilliPercent;

        // Emit an event to register the change
        emit FactorySettingsUpdated(_newOwnerWallet, _newRentFeeMilliPercent, _newCollateralFeeMilliPercent);
    }

    // Function to retrieve all created rental contracts
    function getAllRentalContracts() external view returns (address[] memory) {
        return rentalContracts;
    }
}
