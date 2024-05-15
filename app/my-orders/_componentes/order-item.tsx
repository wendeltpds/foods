"use client"
import { Avatar } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { formatCurrency } from "@/app/_helpers/price";
import { OrderStatus, Prisma } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface OrderItemProps {
    order: Prisma.OrderGetPayload<{
        include: {
            restaurant: true
            products: {
                include: {
                    product: true
                }
            }
        }
    }>
}

const getOrderStatusLabel = (status: OrderStatus) => {
    switch (status){
        case 'CANCELED':
            return 'cancelado'
        case  'COMPLETED':
            return 'entregue'
        case 'CONFIRMED': 
            return 'confirmado'
        case 'DELIVERING':
            return 'em transporte'
        case 'PREPARING':
            return 'Preparando'
    }
}
const OrderItem = ({order}: OrderItemProps) => {
    return ( 
        <Card>
            <CardContent className="p-5">
                <div className=" bg-[#EEEEEE] rounded-full py-1 w-fit px-2"> 
                    <span className=" text-xs block font-semibold">{getOrderStatusLabel(order.status)}</span>                   
                </div>

                <div className="flex justify-between items-center pt-3">
                    <div className=" flex items-center gap-2">
                        <Avatar className=" w-6 h-6">
                            <AvatarImage src={order.restaurant.imageUrl} />
                        </Avatar>

                        <span className=" text-sm font-semibold">
                            {order.restaurant.name}
                        </span>
                    </div>

            <Link href={`restaurants/${order.restaurantId}`}>                    
                        <Button variant="ghost" size="icon" asChild className=" h-5 w-5">
                            <ChevronRightIcon />
                        </Button>
                    </Link>
                </div>

                <div className=" py-3">
                    <Separator />
                </div>

                <div>
                    {order.products.map((product) => (
                        <div key={product.id} className=" flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center">
                               <span className=" block text-xs text-white">{product.quantity}</span>
                            </div>
                               <span className=" text-muted-foreground text-xs">{product.product.name}</span>
                        </div>
                    ))}
                </div>

                <div className=" py-3">
                    <Separator />
                </div>
                <div className="flex items-center justify-between">
                    <p className=" text-sm">{formatCurrency(Number(order.totalPrice))}</p>
                    <Button variant="ghost" size="sm" disabled={order.status !== "COMPLETED"} className=" text-primary text-xs">Adicionar a sacola</Button>
                </div>
            </CardContent>
        </Card>
     );
}
 
export default OrderItem;