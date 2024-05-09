import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/deliveryInfo";
import ProductList from "@/app/_components/product-list";
import CartBanner from "./_components/cart-banner";

interface RestaurantPageProps {
    params: {
        id: string
    }
}

const RestaurantPage = async({params:{id}}: RestaurantPageProps) => {

    const restaurant = await db.restaurant.findUnique({
        where: {
            id,
        },
        include: {
            categories: {
                include: {
                    products: {
                        where: {
                            restaurantId: id
                        },
                        include: {
                            restaurant: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                },
            },
            products: {
                take:10,
                include: {
                    restaurant: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })

    if (!restaurant){
        return notFound()
    }
    return ( 
        <div>
            <RestaurantImage restaurant={restaurant} />

            <div className="flex justify-between items-center px-5 pt-5 relative z-50 mt-[-1.5rem] rounded-tl-3xl py-5 rounded-tr-3xl bg-white">
                <div className="flex items-center gap-[0.375rem]">
                    <div className=" relative h-8 w-8 ">
                        <Image src={restaurant.imageUrl} 
                        alt={restaurant.name}
                        fill
                        className=" rounded-full object-cover"
                        />
                    </div>
                    <h1 className=" text-xl font-semiboldre">{restaurant.name}</h1>
                </div>

                <div className="top-2 bg-foreground text-white gap-[3px] left-2 rounded-full px-2 py-[2px]  flex items-center bg-white" >
                    <StarIcon size={12} className=" fill-yellow-400 text-yellow-400" />
                    <span className=" font-semibold text-xs" >5,0</span>
                </div>
            </div>

            <div className=" px-5">
                <DeliveryInfo restaurant={restaurant} />
            </div>

            <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-4 px-5 mt-3">
                {restaurant.categories.map((category) => (
                    <div key={category.id} className=" rounded-lg text-center bg-[#f4f4f4] min-w[167px]" >
                        <span className=" text-muted-foreground text-xs" >
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                <h2 className=" font-semibold px-5">Mais pedidos</h2>
                <ProductList products={restaurant.products} />
            </div>

            {restaurant.categories.map((category) => (
                <div className="mt-6 space-y-4" key={category.id}>
                    <h2 className=" font-semibold px-5">{category.name}</h2>
                    <ProductList products={category.products} />
                </div>
            ))}

            <CartBanner restaurant={restaurant} />
        </div>
     );
}
 
export default RestaurantPage;