import Image, { ImageProps } from "next/image";

interface PromoBannerProps {
    
}
export const PromoBanner = (props: ImageProps) => {
    return ( 
        <Image 
        width={0}
        height={0}
        className=" w-full h-auto object-contain"
        sizes="100vw"
        quality={100}
        {...props} />
    );
}