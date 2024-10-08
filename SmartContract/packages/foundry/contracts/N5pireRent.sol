// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract RentalContract {
    // Variables to store item ID, owner address, and renter address
    uint256 public itemId;
    address public ownerAddress;
    address public renterAddress;

    // Event to log when an item is rented
    event ItemRented(uint256 indexed itemId, address indexed owner, address indexed renter);

    // Constructor to initialize itemId and owner address
    constructor(uint256 _itemId, address _ownerAddress) {
        itemId = _itemId;
        ownerAddress = _ownerAddress;
    }

    // Function to store renter address when called and emit event
    function rentItem() external {
        renterAddress = msg.sender; // Capture caller address as the renter

        // Emit the ItemRented event
        emit ItemRented(itemId, ownerAddress, renterAddress);
    }

    // Function to retrieve item details
    function getItemDetails() external view returns (uint256, address, address) {
        return (itemId, ownerAddress, renterAddress);
    }
}