import { useContext } from "react";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { CartContext } from "../_providers/cart";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {

    const { products , SubTotalPrice , TotalPrice , TototalDiscounts } = useContext(CartContext)

    return (      
            <div className="py-5 h-full flex flex-col" >

                {products.length > 0 ? (       
                    <>                    
                        <div className=" space-y-4 flex-auto">
                            {products.map((produto) => (
                                <CartItem  key={produto.id} cartProduct={produto}/>
                            ))}
                        </div>

                        <div className="mt-6">
                                <Card>
                                    <CardContent className=" p-5 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className=" text-muted-foreground">SubTotal</span>
                                            <span>{formatCurrency(SubTotalPrice)}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center text-xs">
                                            <span className=" text-muted-foreground">Descontos</span>
                                            <span> - {formatCurrency(TototalDiscounts)}</span>
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
                                            <span>{formatCurrency(TotalPrice)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                        </div>

                        <Button className=" w-full mt-6">Finalizar pedido</Button>
                    </>
                ) : (
                    <h1 className=" text-center font-semibold">Ops! Parece que sua sacola está vazia</h1>
                )
            }

            </div>
    );
}
 
export default Cart;