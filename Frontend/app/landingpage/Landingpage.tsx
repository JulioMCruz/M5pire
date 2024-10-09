"use client";
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

const Landingpage = () => {
  useEffect(() => {
    // GSAP stagger animation targeting all spans with the class 'letter'
    gsap.to(".letter", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15, // Animates each letter sequentially with a delay
      // Start from opacity 0 and y 50
      from: {
        opacity: 0,
        y: 50,
      },
    });
  }, []);

  const letters = ['M', '5', 'p', 'i', 'r', 'e'];
  const { address } = useAccount()
  const router= useRouter()
  useEffect(() => {
    if (address) {
      router.push("/listings");
    }
  }, [address]);
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <h1 className="text-white text-8xl font-bold">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="letter inline-block"
            style={{ opacity: 0 }} // Ensure initial state of opacity 0
          >
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Landingpage;
