import { db } from "../_lib/prisma";
import RestaurantItem from "./RestaurantItem";

const RestaurantList = async() => {
    const restaurants = await db.restaurant.findMany({take:10})
    return ( 
        <div className=" flex overflow-x-scroll" >
            {restaurants.map((restaurant) => (
                <RestaurantItem key={restaurant.id} restaurant={restaurant} />
            ))}
        </div>
    );
}
 
export default RestaurantList;