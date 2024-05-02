import { Button } from "@/app/_components/ui/button";
import { calculateProductTotalPrice, formatCurrency } from "@/app/_helpers/price";
import { db } from "@/app/_lib/prisma";
import { ArrowDownIcon, ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import ProductImage from "./_components/product-image";
import DiscountBadge from "@/app/_components/discount-badge";
import ProductDetails from "./_components/products-details";

interface ProductsPageProps {
    params: {
        id: string;
    }
}

const ProductsPage = async({params: {id}}: ProductsPageProps) => {



    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            restaurant:true
        }
    })

    const juices = await db.product.findMany({
        where: {
            category: {
                name: 'Sucos'
            }
        },
        include: {
            restaurant:true
        },
        take: 10
    })

    if(!product){
        return
    }

    return ( 
        <div>
        <ProductImage product={product} />

        <ProductDetails product={product} complementaryProducts={juices} />
        </div>
    );
}
 
export default ProductsPage;