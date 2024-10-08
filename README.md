# M5 Rental Platform

M5 Rental Platform is a decentralized application (dApp) for renting items, with a focus on snowboard rentals. It utilizes smart contracts on the Ethereum blockchain to facilitate secure and transparent rental transactions.

## Smart Contract

The smart contract component of the M5 Rental Platform consists of two main contracts:

1. M5RentalContractFactory: This contract is responsible for creating individual rental contracts for each item listed on the platform.

2. M5RentalContract: This contract manages the rental process for a specific item, including renting, returning, and handling payments.

### Rental Process Flow

The following sequence diagram illustrates the snowboard rental process:

[Insert the sequence diagram here]

## Frontend

The frontend of the M5 Rental Platform is built using Next.js, providing a user-friendly interface for interacting with the smart contracts. Key features include:

- Listing items for rent
- Browsing available rental items
- Initiating and managing rental transactions
- Handling payments and collateral

## Snowboard Rental Process

![M5 Rental Platform Overview](SmartContract/images/smart-contract-workflow.png)

## Verifier (Future Implementation)

The Verifier is a planned future implementation that will generate a social score for users based on their email addresses. This feature aims to enhance trust and security within the platform by providing additional user verification.

Key aspects of the Verifier:

- Email-based user verification
- Social score generation
- Integration with the rental process for enhanced security
