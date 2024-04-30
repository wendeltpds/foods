import Image from "next/image";
import Header from "./_components/header";
import Search from "./_components/search";
import CategoryList from "./_components/category-list";
import Banner from "./../public/Banner.png"

export default function Home() {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="px-5 pt-6">
        <CategoryList />
      </div>

      <div className=" px-5 pt-6" >        
        <Image src={Banner} 
          alt="ate 30% de desconto em pizzas"
          width={0}
          height={0}
          className=" w-full h-auto object-contain"
          sizes="100vw"
          quality={100} />
      </div>
    </>
  )
}
