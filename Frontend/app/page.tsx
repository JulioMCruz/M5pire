"use client";

import HeaderComponent from "@/components/Header";
import { useAccount} from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  return (
    <div>
      <HeaderComponent />
      { address && (<div>Connected</div>)}
      { !address && (<div>Not Connected</div>)}
    </div>
  );
}
