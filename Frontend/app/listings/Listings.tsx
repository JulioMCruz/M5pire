"use client";

import HeaderComponent from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import ProductItem from "../../components/listings/ProductItem";
import { productsService } from "../../services/products.service";

export default function Listings() {

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });

  return (
    <div>
      <HeaderComponent />
      <div className="flex md3:pt-2">
        <div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 p-[60px_20px] md2:ml-[300px] md3:m-0 md3:p-[40px_20px]">
            {data && data.map(obj => <ProductItem key={obj.id} {...obj} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
