import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryItemProps {
    category: Category
}

const CategoryItem = ({category}: CategoryItemProps) => {
    return ( 
        <Link href={`/categories/${category.id}/products`} >        
            <div className=" flex justify-center items-center bg-white shadow-md rounded-full py-3 px-4 gap-3 m-2" >
                <Image src={category.imageUrl} alt={category.name} height={30} width={30}/>
                <span className=" text-sm font-semibold" >{category.name}</span>
            </div>
        </Link>
     );
}
 
export default CategoryItem;