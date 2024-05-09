 "use client"

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct extends Prisma.ProductGetPayload<{include:{
  restaurant: {
    select: {
      deliveryFee: true,
    }
  }
}}>{
    quantity: number 
}

interface IcartContext {
    products: CartProduct[];
    TotalPrice: number;
    SubTotalPrice:number;
    TototalDiscounts: number;
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
}

export const CartContext = createContext<IcartContext>({
    products:[],
    TotalPrice: 0,
    SubTotalPrice:0,
    TototalDiscounts: 0,
    addProductsToCart: () => {},
    decreaseProductQuantity: () => {},
    IncreaseProductQuantity: () => {},
    removeProductFromCart: () => {},
})

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [products, setProducts] = useState<CartProduct[]>([])

    const SubTotalPrice = useMemo(() => {
      return products.reduce((acc , product) => {
        return acc + Number(product.price) * product.quantity
      }, 0)
    }, [products])

    const TotalPrice = useMemo(() => {
      return products.reduce((acc , product) => {
        return acc + calculateProductTotalPrice(product) * product.quantity
      }, 0)
    }, [products]);

    const TototalDiscounts = SubTotalPrice - TotalPrice

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
          TotalPrice,
          SubTotalPrice, 
          TototalDiscounts,
        }}> 
            {children}
        </CartContext.Provider>
    )
}

/* eslint-disable no-unused-vars */
/*"use client";

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          id: true;
          deliveryFee: true;
          deliveryTimeMinutes: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;
  totalDiscounts: number;
  totalQuantity: number;
  addProductToCart: ({
    product,
    emptyCart,
  }: {
    product: CartProduct;
    emptyCart?: boolean;
  }) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  totalQuantity: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotalPrice = products.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity;
  }, 0);

  const totalPrice =
    products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0) + Number(products?.[0]?.restaurant?.deliveryFee);

  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  const totalDiscounts =
    subtotalPrice - totalPrice + Number(products?.[0]?.restaurant?.deliveryFee);

  const clearCart = () => {
    return setProducts([]);
  };

  const decreaseProductQuantity: ICartContext["decreaseProductQuantity"] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct;
          }

          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const increaseProductQuantity: ICartContext["increaseProductQuantity"] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const removeProductFromCart: ICartContext["removeProductFromCart"] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  };

  const addProductToCart: ICartContext["addProductToCart"] = ({
    product,
    emptyCart,
  }) => {
    if (emptyCart) {
      setProducts([]);
    }


    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );


    if (isProductAlreadyOnCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + product.quantity,
            };
          }

          return cartProduct;
        }),
      );
    }


    setProducts((prev) => [...prev, product]);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subtotalPrice,
        totalPrice,
        totalDiscounts,
        totalQuantity,
        clearCart,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};*/