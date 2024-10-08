// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "../contracts/M5RentalContractFactory.sol";
import "../contracts/M5RentalContract.sol";

// To-do: fix some test... :(

contract RentalContractTest is Test {
    M5RentalContractFactory factory;
    M5RentalContract rental;

    address owner = address(0x1);
    address renter = address(0x2);
    uint256 startTime;
    uint256 endTime;

    function setUp() public {
        // Set up the factory and deploy a new rental contract
        factory = new M5RentalContractFactory();
        address rentalAddress = factory.createRentalContract(1 ether, 2 ether);
        rental = M5RentalContract(rentalAddress);

        // Define startTime as the current timestamp and endTime as two hours later
        startTime = block.timestamp + 1 hours;
        endTime = startTime + 2 hours; // Rental period of 2 hours
    }

    function testRentItem() public {
        // Simulate renting an item with the correct collateral
        vm.deal(renter, 3 ether); // Ensure renter has enough balance
        vm.prank(renter); // Simulate renter calling the function
        rental.rentItem{value: 2 ether}(startTime, endTime);

        // Verify if the state has been updated
        (, , address actualRenter, , , , , , ) = rental.getItemDetails();
        assertEq(actualRenter, renter);
    }

    function testReturnItemAndReleaseCollateral() public {
        // Simulate renting an item
        vm.deal(renter, 3 ether); // Ensure renter has enough balance
        vm.prank(renter); 
        rental.rentItem{value: 2 ether}(startTime, endTime);

        // Log the rent price being calculated
        uint256 rentPrice = rental.calculateRentPrice(startTime, endTime);
        emit log_named_uint("Calculated Rent Price", rentPrice);

        // Simulate returning the item with the exact rent price
        vm.prank(renter); 
        rental.returnItem{value: rentPrice}(); // Now using the exact rent price calculated by the contract

        // Check if the item is available again
        (, , address actualRenter, , , , , , ) = rental.getItemDetails();
        assertEq(actualRenter, address(0));  // Verify that the item has been released
    }

    function testFeesSentToFactoryOwner() public {
        // Simulate renting and returning the item
        vm.deal(renter, 3 ether); // Ensure renter has enough balance
        vm.prank(renter); 
        rental.rentItem{value: 2 ether}(startTime, endTime);

        // Get the exact rent price using the contract function
        uint256 rentPrice = rental.calculateRentPrice(startTime, endTime);
        emit log_named_uint("Calculated Rent Price", rentPrice);

        // Simulate returning the item with the exact rent price
        vm.prank(renter); 
        rental.returnItem{value: rentPrice}(); // Now using the exact rent price calculated by the contract

        // Check if the factory owner received the fees
        uint256 balanceBefore = factory.factoryOwner().balance;
        uint256 rentFee = (rentPrice * factory.rentFeeMilliPercent()) / 1000;
        emit log_named_uint("Calculated Rent Fee", rentFee);

        assertEq(factory.factoryOwner().balance, balanceBefore + rentFee);
    }
}
