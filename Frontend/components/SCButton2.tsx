"use client";

import React from 'react';


import { useWriteContract } from 'wagmi'


const rentalContractABI = [
  {
    "inputs": [],
    "name": "rentItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getItemDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "renter",
        "type": "address"
      }
    ],
    "name": "ItemRented",
    "type": "event"
  }
];

const SCButton2: React.FC = () => {

  const { writeContract } = useWriteContract()

  return (
<button 
      onClick={() => 
        writeContract({ 
          abi: rentalContractABI,
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          functionName: 'rentItem',
          // args: [
          //   '0xd2135CfB216b74109775236E36d4b433F1DF507B',
          //   '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
          //   123n,
          // ],
       })
      }
    >
      Transfer
    </button>
  );
};

export default SCButton2;
