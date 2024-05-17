"use client"
import { Restaurant } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurant } from "./_actions/search";
import RestaurantItem from "../_components/RestaurantItem";

const RestaurantSearchResults = () => {
    const searchParams = useSearchParams();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const searchFor = searchParams.get("search");

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!searchFor) return;

            const foundRestaurants = await searchForRestaurant(searchFor);
            setRestaurants(foundRestaurants);
        }
        fetchRestaurants();
    }, [searchFor]);

    if (!searchFor) {
        return null;
    }

    return (
        <div className="space-x-2 px-5 gap-6 grid grid-cols-2">
            {restaurants.map((restaurant) => (
                <RestaurantItem
                    key={restaurant.id}
                    restaurant={restaurant}
                    className="min-w-full max-w-full"
                />
            ))}
        </div>
    );
}

export default RestaurantSearchResults;
