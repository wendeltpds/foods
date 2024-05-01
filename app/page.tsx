import Image from "next/image";
import Header from "./_components/header";
import Search from "./_components/search";
import CategoryList from "./_components/category-list";
import Banner from "./../public/Banner.png"
import ProductList from "./_components/product-list";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";

export default async function Home() {

  const products = await db.product.findMany({
    where:{
        discountPercentage:{
            gt: 0
        }
    },
    take: 10,
    include: {
        restaurant: {
            select: {
                name: true,
            }
        }
    },
})

  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="px-5 pt-6">
        <CategoryList />
      </div>

      <div className=" px-5 pt-6" >        
        <Image src={Banner} 
          alt="ate 30% de desconto em pizzas"
          width={0}
          height={0}
          className=" w-full h-auto object-contain"
          sizes="100vw"
          quality={100} />
      </div>

      <div className=" pt-6 space-y-4">
        <div className="px-5 flex justify-between items-center">
          <h2 className=" font-semibold" >Pedidos Recomendados</h2>
          <Button variant="ghost" className=" h-fit text-primary p-0 hover:bg-transparent flex" >Ver Todos  
            <ChevronRightIcon />
          </Button>

        </div>
        <ProductList products={products} />
      </div>
    </>
  )
}
