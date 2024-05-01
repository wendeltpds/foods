import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ArrowDownIcon } from "lucide-react";

interface ProductItemProps {
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name:true,
                }
            }
        }
    }>
}

const ProductItem = ({product}: ProductItemProps) => {
    return ( 
        <div className=" w-[150px] min-w-[150px] space-y-2" >
            <div className="h-[150px] w-full relative " >
                <Image src={product.imageUrl} alt={product.name} fill 
                className=" object-cover rounded-lg shadow-md"/>

                {product.discountPercentage > 0 && (
                    <div className=" absolute top-2 gap-[2px] left-2 rounded-full bg-primary px-2 py-[2px] text-white flex items-center" >
                        <ArrowDownIcon size={12} />
                        <span className=" font-semibold text-xs" >{product.discountPercentage}%</span>
                    </div>
                )}
            </div>

            <div>
                <h2 className=" text-sm truncate" >
                    {product.name}
                </h2>
                <div className=" flex gap-1 items-center">
                    <h3 className=" font-semibold" >
                        {formatCurrency(calculateProductTotalPrice(product))}
                    </h3>
                    
                    {product.discountPercentage > 0 && (
                        <span className=" line-through text-muted-foreground text-xs" >
                        {formatCurrency(Number(product.price))}
                        </span>
                    )}
            </div>
                <span className=" text-muted-foreground text-xs block" >
                    {product.restaurant.name}
                </span>


            </div>
        </div>
     );
}
 
export default ProductItem;