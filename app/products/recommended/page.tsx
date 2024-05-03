import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedPrductsPage = async() => {

    const products = await db.product.findMany({
        where:{
            discountPercentage:{
                gt: 0
            }
        },
        take: 20,
        include: {
            restaurant: {
                select: {
                    name: true,
                }
            }
        },
    })
    
    return ( 
        <div>
        <Header />     
        <div className=" px-5 py-6">
            <h2 className="text-lg font-semibold mb-6">Pedidos Recomendados</h2>
            <div className=" grid grid-cols-2 gap-6">
                {products.map((product) => (
                    <ProductItem  key={product.id} product={product} className=" w-full"/>
                ))}
            </div>
        </div>
    </div>
    );
}
 
export default RecommendedPrductsPage;