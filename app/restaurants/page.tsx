"use client"
import { Suspense } from "react";
import Header from "../_components/header";
import RestaurantSearchResults from "./RestaurantSearchResults";

const Restaurants = () => {
    return (      
        <>   
            <Header /> 
            <div className="px-5 py-6">
                <h2 className="text-lg font-semibold mb-6">Restaurantes Encontrados</h2>
                <Suspense fallback={<div>Carregando...</div>}>
                    <RestaurantSearchResults />
                </Suspense>
            </div>
        </>
    );
}

export default Restaurants;



