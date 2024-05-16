"use client"

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct extends Prisma.ProductGetPayload<{
  include:{
    restaurant: {
      select: {
        id: true;
        deliveryFee: true;
        deliveryTimeMinutes: true
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
    addProductToCart: (product: Prisma.ProductGetPayload<{include:{
      restaurant:{
        select:{
          deliveryFee:true
          deliveryTimeMinutes: true
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
    addProductToCart: () => {},
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
    
    const addProductToCart = (product: Prisma.ProductGetPayload<{include:{
      restaurant:{
        select:{
          deliveryFee:true
          deliveryTimeMinutes: true
        }
      }
    }}>, quantity: number) => {

      const hasDifferentRestaurantProduct = products.some((cartproduct) => {
        cartproduct.id !== product.id
      })

      if(hasDifferentRestaurantProduct){
        setProducts([])
      }

      const isProductAlreadyOnCart = products.some(cartProducts => cartProducts.id === product.id)

        if(isProductAlreadyOnCart) {
             setProducts((prev) => 
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

        /*setProducts((prev) => [...prev , {...product , quantity}])*/
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
          addProductToCart, 
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


/* eslint-disable no-unused-vars */






/* eslint-disable no-unused-vars */
/*"use client";

import { Prisma } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
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

  const subtotalPrice = useMemo(() => {
    return products.reduce((acc , product) => {
      return acc + Number(product.price) * product.quantity
    }, 0)
  }, [products])

  const totalPrice = useMemo(() => {
    return products.reduce((acc , product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity
    }, 0)
  }, [products]);

    const totalQuantity = useMemo(() => {
      return products.reduce((total , produto) => {
        return total + produto.quantity
      }, 0)
    }, [products])

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

    // VERIFICAR SE O PRODUTO JÁ ESTÁ NO CARRINHO
    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    // SE ELE ESTIVER, AUMENTAR A SUA QUANTIDADE
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