"use client";

import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { SVGProps, useEffect, useState } from "react";
import {
  DynamicWidget,
  useTelegramLogin,
  useDynamicContext,
} from "../lib/dynamic";

import Spinner from "./Spinner";
import { ArrowLeftRight, Key, MessageCircle } from "lucide-react";

export default function HeaderComponent() {

  const { sdkHasLoaded, user } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sdkHasLoaded) return;
    // console.log("sdkHasLoaded - true");
    
    const signIn = async () => {
      if (!user) {
        // console.log("user - signing in");
        await telegramSignIn({ forceCreateUser: true });
        // console.log("user - telegramSignIn");
      }
      setIsLoading(false);
    };

    signIn();
  }, [sdkHasLoaded]);

  return (
    <div className="flex justify-center">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-background border border-muted shadow-md rounded-md mx-4">
        <nav className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-8">
                <SheetTitle>M5pire</SheetTitle>
              </SheetHeader>

                  <Link key="m-01" href="/listings" prefetch={false}
                  className="flex w-full items-center gap-2 my-4 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                      Listings
                  </Link>
                  <Link key="m-01" href="/socialfi" prefetch={false}
                  className="flex w-full items-center gap-2 my-4 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                      SocialFi
                  </Link>
                  <Link key="m-01" href="/myrentals" prefetch={false}
                  className="flex w-full items-center gap-2 my-4 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                      My rentals
                  </Link>
                  <Link key="m-01" href="/return" prefetch={false}
                  className="flex w-full items-center gap-2 my-4 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                      Return
                  </Link>

            </SheetContent>
          </Sheet>
        </nav>

        <Link href="/" className="mr-6 flex items-center" prefetch={false}>
          <Image src="/images/M5pire.png" alt={`M5pire logo`} width={60} height={60} className="h-fit"/>
          <span className="sr-only">M5pire</span>
        </Link>{" "}

        <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
          <NavigationMenu>
            <NavigationMenuList>

                    <NavigationMenuItem key="m-01">
                      <NavigationMenuLink asChild>
                          <Link
                          href="/listings"
                          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                          prefetch={false}
                          >
                            <ArrowLeftRight size={20} className="inline-block mr-2" />
                          Listings
                          </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem key="m-02">
                      <NavigationMenuLink asChild>
                          <Link
                          href="/socialfi"
                          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                          prefetch={false}
                          >
                            <MessageCircle size={20}  className="inline-block mr-2" />
                          SocialFi
                          </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem key="m-02">
                      <NavigationMenuLink asChild>
                          <Link
                          href="/myrentals"
                          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                          prefetch={false}
                          >
                            <Key size={20}  className="inline-block mr-2" />
                          My rentals
                          </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem key="m-02">
                      <NavigationMenuLink asChild>
                          <Link
                          href="/return"
                          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                          prefetch={false}
                          >
                            <Key size={20}  className="inline-block mr-2" />
                          Return
                          </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="ml-auto flex items-center gap-4">

        <div className="ml-auto flex items-center gap-4">
        {isLoading ? <Spinner /> : <DynamicWidget />}
        </div>

        </div>
      </header>
    </div>
  )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
