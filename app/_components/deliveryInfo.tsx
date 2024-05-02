import { BikeIcon, TimerIcon } from "lucide-react";
import { Card } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Restaurant } from "@prisma/client";

interface DeliveryInfoProps {
    restaurant: Pick<Restaurant, "deliveryFee"| 'deliveryTimeMinutes'>
}
const DeliveryInfo = ({restaurant}: DeliveryInfoProps) => {
    return ( 
        <>
        <Card className=" flex justify-around py-3 mt-6" >
            <div className=" flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BikeIcon size={14}/>
                    <span className=" text-xs" >Entraga</span>
                </div>

                {Number(restaurant.deliveryFee) > 0 ? (
                    <p className=" text-xs font-semibold">
                        {formatCurrency(Number(restaurant.deliveryFee))}
                    </p>
                ) : (
                    <p className=" text-xs font-semibold" >Gratis</p>
                )
            }
            </div>


            <div className=" flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <TimerIcon size={14}/>
                    <span className=" text-xs" >Entraga</span>
                </div>

                <p className=" text-xs font-semibold">
                    {restaurant.deliveryTimeMinutes} min
                </p>

            </div>
        </Card>
    </>
    );
}
 
export default DeliveryInfo;