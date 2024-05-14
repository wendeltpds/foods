 "use client"

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct extends Prisma.ProductGetPayload<{include:{
  restaurant: {
    select: {
      id: true;
      deliveryFee: true;
      deliveryTimeMinutes: true;
    }
  }
}}>{
    quantity: number 
}

interface IcartContext {
    products: CartProduct[];
    totalPrice: number;
    subtotalPrice:number;
    totalDiscounts: number;
    TototalQuantity: number;
    addProductsToCart: (product: Prisma.ProductGetPayload<{include:{
      restaurant:{
        select:{
          deliveryFee:true
        }
      }
    }}>, quantity: number) => void
    decreaseProductQuantity: (productId : string) => void
    IncreaseProductQuantity: (productId: string) => void
    removeProductFromCart: (productId: string) => void
    clearCart: () => void
}

export const CartContext = createContext<IcartContext>({
    products:[],
    totalPrice: 0,
    subtotalPrice:0,
    totalDiscounts: 0,
    TototalQuantity: 0,
    addProductsToCart: () => {},
    decreaseProductQuantity: () => {},
    IncreaseProductQuantity: () => {},
    removeProductFromCart: () => {},
    clearCart: () => {},
})

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [products, setProducts] = useState<CartProduct[]>([])

    const subtotalPrice = useMemo(() => {
      return products.reduce((acc , product) => {
        return acc + Number(product.price) * product.quantity
      }, 0)
    }, [products])

    const TototalQuantity = useMemo(() => {
      return products.reduce((total , produto) => {
        return total + produto.quantity
      }, 0)
    }, [products])

    const totalPrice = useMemo(() => {
      return products.reduce((acc , product) => {
        return acc + calculateProductTotalPrice(product) * product.quantity
      }, 0)
    }, [products]);

    const totalDiscounts = subtotalPrice - totalPrice

    const clearCart = () => {
      return setProducts([])
    }

    const removeProductFromCart =  (productId: string) => {
      return setProducts((prev) => prev.filter((product) => product.id !== productId ))
    }
    
    const addProductsToCart = (product: Prisma.ProductGetPayload<{include:{
      restaurant:{
        select:{
          deliveryFee:true
        }
      }
    }}>, quantity: number) => {

      const hasDifferentRestaurantProduct = products.some((cartproduct) => {
        cartproduct.id === product.id
      })

      if(hasDifferentRestaurantProduct){
        setProducts([])
      }

      const isProductAlreadyOnCart = products.some(cartProducts => cartProducts.id === product.id)

        if(isProductAlreadyOnCart) {
            return setProducts((prev) => 
                prev.map((cartProduct) => {
                if(cartProduct.id === product.id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity,
                    }
                }
                return cartProduct;
          })
        )       
      }
        
        setProducts(prev => [...prev , {...product , quantity: quantity}])
      }
      
      const decreaseProductQuantity = (productId: string) => {
        return setProducts((prev) => 
            prev.map((cartProduct) => {
                if(cartProduct.id === productId) {
                  if(cartProduct.quantity === 1){
                    return cartProduct
                  }
                  return{
                    ...cartProduct,
                    quantity:cartProduct.quantity - 1
                  }
                }
                return cartProduct;
            })
        )
      }

      const IncreaseProductQuantity = (productId: string) => {
        return setProducts((prev) => 
            prev.map((cartProduct) => {
                if(cartProduct.id === productId) {
                  return{
                    ...cartProduct,
                    quantity:cartProduct.quantity + 1
                  }
                }
                return cartProduct;
            })
        )
      }

      return (
        <CartContext.Provider value={{products, 
          addProductsToCart, 
          decreaseProductQuantity, 
          IncreaseProductQuantity, 
          removeProductFromCart,
          clearCart,
          totalPrice,
          subtotalPrice, 
          totalDiscounts,
          TototalQuantity,
        }}> 
            {children}
        </CartContext.Provider>
    )
}