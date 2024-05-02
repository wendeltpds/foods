import { Restaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";

interface RestaurantItemProps {
    restaurant: Restaurant
}

const RestaurantItem = ({restaurant}: RestaurantItemProps) => {
    return ( 
        <Link href={`/restaurants/${restaurant.id}`} className=" min-w-[266px] max-w-[266px] " >        
            <div className="space-y-3 w-full" >
                <div className=" w-full h-[136px] relative" >
                    <Image  
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    fill 
                    className=" object-cover rounded-lg" 
                    />
                


                <div className=" absolute top-2 gap-[2px] left-2 rounded-full bg-primary px-2 py-[2px]  flex items-center bg-white" >
                    <StarIcon size={12} className=" fill-yellow-400 text-yellow-400" />
                    <span className=" font-semibold text-xs" >5,0</span>
                </div>

                <Button className=" absolute top-2 right-2 bg-gray-700 rounded-full h-7" >
                    <HeartIcon className=" fill-white"  size={16}/>
                </Button>
    

                </div>

                <div>
                    <h3 className=" font-semibold text-sm" >{restaurant.name}</h3>
                </div>

                <div className="flex gap-3">

                    <div className="flex gap-1 items-center">
                        <BikeIcon className=" text-primary" size={14} />
                        <span className=" text-xs text-muted-foreground" >
                        {Number(restaurant.deliveryFee) === 0 ? 
                        <h1>entrega gratis</h1> : 
                            formatCurrency(Number(restaurant.deliveryFee))
                        }
                        </span>
                    </div>

                    <div className="flex gap-1 items-center">
                        <TimerIcon className=" text-primary" size={14} />
                        <span className=" text-xs text-muted-foreground" >
                            {restaurant.deliveryTimeMinutes} mins
                        </span>
                    </div>
                </div>
            </div>
        </Link>
     );
}
 
export default RestaurantItem;