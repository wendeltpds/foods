"use client"

import Cart from "@/app/_components/cart";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { formatCurrency } from "@/app/_helpers/price";
import { CartContext } from "@/app/_providers/cart";
import { Restaurant } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useContext } from "react";

interface CartBannerProps {
    restaurant: Pick<Restaurant, "id">
}

const CartBanner = ({restaurant}: CartBannerProps) => {
    const {products , totalPrice , TototalQuantity} = useContext(CartContext)
    return ( 
        <>        
            {products.length > 0 && (            
                <div className=" fixed bottom-0 left-0 z-50 w-full
                bg-white p-5 pt-3 border-t border-muted-foreground">
                    <div className=" flex justify-between items-center">
                        <div className=" space-y-2">
                            <span className="text-xs text-muted-foreground">Total sem entrega</span>
                            <h3 className=" font-semibold" >{formatCurrency(totalPrice)} / <span>{TototalQuantity} {TototalQuantity > 1 ? "itens" : "item"}</span></h3>
                        </div>

                        <Sheet>
                            <SheetTrigger>
                                <Button>Ver sacola</Button>
                            </SheetTrigger>

                            <SheetContent className="w-[90vw]" >
                                <SheetHeader>
                                    <SheetTitle className=" text-left" >Sacola</SheetTitle>
                                </SheetHeader>
                                <Cart />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            )}
        </>
     );
}
 
export default CartBanner;