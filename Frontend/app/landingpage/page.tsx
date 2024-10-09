import HeaderComponent from "@/components/Header";
import Landingpage from "./Landingpage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Landingpage`,
};

export default function ListingsPage() {
    return (
        <div>
          <HeaderComponent />
          <Landingpage />
        </div>
      );
}
