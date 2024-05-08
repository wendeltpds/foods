"use client"
import { Restaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurant } from "./_actions/search";
import Header from "../_components/header";
import RestaurantItem from "../_components/RestaurantItem";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchRestaurants = async () => {
            const searchFor = searchParams.get("search")
            if(!searchFor) return
            const foundRestaurants = await searchForRestaurant(searchFor);
            setRestaurants(foundRestaurants)

        }
        fetchRestaurants()
    }, [searchParams])
    
    return (      
        <>   
            <Header /> 
            
                <div className=" px-5 py-6">
                    <h2 className="text-lg font-semibold mb-6">Restaurantes Encontrados</h2>
        
                    {restaurants.length > 0 ? (
                        <div className=" space-x-2 px-5 gap-6 grid grid-cols-2">               
                            {restaurants.map((restaurant) => (
                                <RestaurantItem  key={restaurant.id} restaurant={restaurant} className=" min-w-full max-w-full"/>
                            ))}
                        </div>
                    ) : (
                        <h1 className=" text-red-800 font-black flex justify-center" >Nenhum restaurante encontrado</h1> 
                    )
                    }
        
                </div>
            </>
        )
    }
    
    export default Restaurants;


