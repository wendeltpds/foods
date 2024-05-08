import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { CartContext, CartProduct } from "../_providers/cart";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { useContext } from "react";

interface CartItemProps {
    cartProduct: CartProduct
}

const CartItem = ({cartProduct}: CartItemProps) => {
    const{ decreaseProductQuantity , IncreaseProductQuantity, removeProductFromCart} = useContext(CartContext)

    const handleDecreaseQuantityClick = () => {
        decreaseProductQuantity(cartProduct.id)
    }

    const handleIncreaseQuantityClick = () => {
        IncreaseProductQuantity(cartProduct.id)
    }

    const handleDeleteClick = () => {
        removeProductFromCart(cartProduct.id)
    }
    return ( 
        <div className=" flex items-center justify-between">
            <div className=" flex items-center gap-4">

                <div className=" relative h-20 w-28 rounded-lg" >
                    <Image src={cartProduct.imageUrl} alt={cartProduct.name} 
                    fill
                    className="rounded-lg object-cover"
                    />
                </div>

                <div className=" space-y-2">

                    <h3 className=" text-xs" >{cartProduct.name}</h3>

                    <div className="flex items-center gap-1">
                        <h4 className=" text-sm font-semibold" >{formatCurrency(calculateProductTotalPrice(cartProduct) * cartProduct.quantity)}</h4>
                        {cartProduct.discountPercentage > 0 && (
                            <span className=" text-xs line-through text-muted-foreground">
                                {formatCurrency(Number(cartProduct.price) * cartProduct.quantity)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center">
                    <div className="flex gap-3 items-center">
                        <Button size="icon" 
                            variant="ghost"
                            className=" 
                            border-muted-foreground border-solid border h-8 w-8"
                            onClick={handleDecreaseQuantityClick}
                        >
                            <ChevronLeftIcon size={18}/>
                        </Button>
                        <span className=" w-4 text-sm">{cartProduct.quantity}</span>
                        <Button 
                            size="icon"
                            className=" h-8 w-8"
                            onClick={handleIncreaseQuantityClick}
                        >
                            <ChevronRightIcon  size={18}/>
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
            <Button size="icon" 
            variant={"ghost"}
            className="h-8 w-8 border border-solid border-muted-foreground"
            onClick={handleDeleteClick}
            >
                <TrashIcon size={18} />
            </Button>
        </div>
    );
}
 
export default CartItem;