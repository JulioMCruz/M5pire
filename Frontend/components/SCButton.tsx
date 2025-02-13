"use client";

import { FC, FormEventHandler, useState } from "react";

import { parseEther } from "viem";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

const SendTransactionSection: FC = () => {
  
  const { primaryWallet } = useDynamicContext();

  const [txnHash, setTxnHash] = useState("");

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const address = formData.get("address") as string;
    const amount = formData.get("amount") as string;

    const publicClient = await primaryWallet.getPublicClient();
    const walletClient = await primaryWallet.getWalletClient();

    const transaction = {
      to: address,
      value: amount ? parseEther(amount) : undefined,
    };

    const hash = await walletClient.sendTransaction(transaction);
    setTxnHash(hash);

    const receipt = await publicClient.getTransactionReceipt({
      hash,
    });

    console.log(receipt);
  };

  return (
    <form onSubmit={onSubmit}>
      <p>Send to ETH address</p>
      <input name="address" type="text" required placeholder="Address" />
      <input name="amount" type="text" required placeholder="0.001" />
      <button type="submit">Send</button>
      <span data-testid="transaction-section-result-hash">{txnHash}</span>
    </form>
  );
};

export default SendTransactionSection;
