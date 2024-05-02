"use client"
import { calculateProductTotalPrice, formatCurrency } from "@/app/_helpers/price";
import Image from "next/image";
import DiscountBadge from "@/app/_components/discount-badge";
import { Prisma, Product } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { BikeIcon, ChevronLeftIcon, ChevronRightIcon, SpaceIcon, TimerIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@/app/_components/ui/card";
import ProductList from "@/app/_components/product-list";
import DeliveryInfo from "@/app/_components/deliveryInfo";

interface ProductDetailsProps {
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant:true
        }
    }>;
    complementaryProducts: Prisma.ProductGetPayload<{
        include: {
            restaurant:true
        }
    }>[]

}

const ProductDetails = ({product, complementaryProducts}: ProductDetailsProps) => {

    const [quantity , setQuantity] = useState(1)

    const handleIncreaseQuantityClick = () => setQuantity(currentState => currentState + 1)
    const handleDecreaseQuantityClick = () => {
        if(quantity === 1) return

        return setQuantity(currentState => currentState - 1)
    };

    return ( 
        <div className=" relative z-50 mt-[-1.5rem] rounded-tl-3xl py-5 rounded-tr-3xl bg-white">
        <div className=" flex items-center gap-[0.375rem] px-5">
            <div className="relative h-6 w-6">
                <Image 
                    src={product?.restaurant.imageUrl} 
                    alt={product?.restaurant.name} 
                    fill
                    className=" rounded-full object-cover"
                />
            </div>
            <span className=" text-muted-foreground text-xs">{product?.restaurant.name}</span>
        </div>

        <h1 className=" mb-3 mt-1 text-xl font-semibold px-5" >{product?.name}</h1>

        <div className="flex justify-between px-5">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className=" font-semibold text-xl" >
                        {formatCurrency(calculateProductTotalPrice(product))}
                    </h2>
                        
                    {product.discountPercentage  && (
                        <DiscountBadge product={product} />
                    )}
                </div>

                {product.discountPercentage &&                         
                    <p className=" text-muted-foreground text-sm">
                        De: {formatCurrency(Number(product.price))}
                    </p>
                }

            </div>

            <div className="flex gap-2 items-center">
                <Button size="icon"
                    variant="ghost" 
                    className=" 
                    border-muted-foreground border-solid border"
                    onClick={handleDecreaseQuantityClick}
                >
                    <ChevronLeftIcon size="icon" className="" />
                </Button>
                <span className=" w-4">{quantity}</span>
                <Button 
                    size="icon"
                    onClick={handleIncreaseQuantityClick}
                >
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>

        <div className=" px-5">
            <DeliveryInfo restaurant={product.restaurant} />
        </div>

        <div className=" mt-6 space-y-3" >
            <h3 className=" font-semibold">sobre</h3>
            <p className=" text-sm text-muted-foreground">{product.description}</p>
        </div>


        <div className=" mt-6 space-y-3" >
            <h3 className=" font-semibold px-5">sucos</h3>
            <ProductList products={complementaryProducts} />
        </div>

        <div className="px-5">
            <Button className=" w-full font-semibold" >Adicionar a sacola</Button>
        </div>
    </div>
    );
}
 
export default ProductDetails;