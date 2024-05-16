import { useContext, useState } from "react";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { CartContext } from "../_providers/cart";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../__actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { error } from "console";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

const Cart = () => {
    const [isSubmitLoading , setisSubmitLoading] = useState(false)
    const [isConfirmDialogOpen , setisConfirmDialogOpen] = useState(false)
    const {data} = useSession()
    const { products , subtotalPrice , totalPrice , totalDiscounts , clearCart } = 
    useContext(CartContext)

    const handleFinishOrderClick = async() => {
        if(!data?.user) return;
        const restaurant = products[0].restaurant;

        try {
            setisSubmitLoading(true)
            await createOrder({
                subtotalPrice,
                totalDiscounts,
                totalPrice,
                deliveryFee: restaurant.deliveryFee,
                deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
                restaurant: {
                    connect: {id: restaurant.id},  
                },
                status: OrderStatus.CONFIRMED,
                user: {
                    connect: {id: data.user.id},
                },
                products: {
                    createMany: {
                        data: products.map((product) => ({
                            productId: product.id,
                            quantity: product.quantity,
                        }))
                    }
                }
            })
            clearCart()
        } catch(error) {
            console.log(error)
        } finally {
            setisSubmitLoading(false)
        }
    }

    return (     
        <>        
            <div className="py-5 h-full flex flex-col" >

                {products.length > 0 ? (       
                    <>                    
                        <div className=" space-y-4 flex-auto">
                            {products.map((produto) => (
                                <CartItem  key={produto?.id} cartProduct={produto}/>
                            ))}
                        </div>

                        <div className="mt-6">
                                <Card>
                                    <CardContent className=" p-5 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className=" text-muted-foreground">SubTotal</span>
                                            <span>{formatCurrency(subtotalPrice)}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center text-xs">
                                            <span className=" text-muted-foreground">Descontos</span>
                                            <span> - {formatCurrency(totalDiscounts)}</span>
                                        </div>

                                        
                                        <Separator />

                                        <div className="flex justify-between items-center text-xs">
                                            <span className=" text-muted-foreground">Entrega</span>

                                            {Number(products[0]?.restaurant.deliveryFee) === 0 ? (
                                                <span className=" uppercase text-primary">Gratis</span> 
                                                ) : ( 
                                                formatCurrency(Number(products[0]?.restaurant.deliveryFee))
                                                )
                                            }
                                        
                                        </div>

                                        
                                        <Separator />

                                        <div className="flex justify-between items-center text-xs font-semibold">
                                            <span>Total</span>
                                            <span>{formatCurrency(totalPrice)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                        </div>

                        <Button className=" w-full mt-6" 
                        onClick={() => setisConfirmDialogOpen(true)}
                        disabled={isSubmitLoading}
                        >
                            finalizar pedido
                        </Button>
                    </>
                ) : (
                    <h1 className=" text-center font-semibold">Ops! Parece que sua sacola está vazia</h1>
                )
            }

            </div>

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setisConfirmDialogOpen}>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao finalizar seu pedido, voce concorda com os termos e condiçoes
                        da nossa plataorma
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel disabled={isConfirmDialogOpen}>
                    Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinishOrderClick} disabled={isSubmitLoading}>
                        {isSubmitLoading && (
                            <Loader2  className=" mr-2 h-4 w-4 animate-spin"/> 
                        )}
                        finalizar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </> 
    );
}
 
export default Cart;