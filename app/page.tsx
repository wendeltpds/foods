import Header from "./_components/header";
import Search from "./_components/search";
import CategoryList from "./_components/category-list";
import Banner from "./../public/Banner.png"
import ProductList from "./_components/product-list";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import { PromoBanner } from "./_components/promoBanner";
import RestaurantList from "./_components/restaurant-list";
import Link from "next/link";

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
          <PromoBanner src={Banner} 
          alt="ate 30% de desconto em pizzas"/>
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

      <div className="px-5 pt-6">
          <PromoBanner src='/Banner (1).png' alt="apartir de R$17,90 em lanches " />
      </div>

      <div className=" pt-6 space-y-4">
        <div className="px-5 flex justify-between items-center">
          <h2 className=" font-semibold" >Restaurantes Recomendados</h2>
          <Link  href={"/restaurants/recomended"}>          
            <Button variant="ghost" className=" h-fit text-primary p-0 hover:bg-transparent flex" >Ver Todos
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
        
        <RestaurantList />

      </div>

    </>
  )
}
