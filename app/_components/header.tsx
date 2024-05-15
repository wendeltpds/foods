"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import { HeartIcon, HomeIcon, ListOrderedIcon, LogInIcon, LogOutIcon, MenuIcon, ScrollTextIcon } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const Header = () => {
    const {data} = useSession()
    return ( 
    <div className=" flex justify-between pt-6 px-5" >
        <div className="relative h-[30px] w-[100px]">
            <Link href={"/"}>            
                <Image src="/logo.png" alt="FSW foods" fill className=" object-cover"/>
            </Link>
        </div>

        <Sheet>
            <SheetTrigger>
                <Button size="icon" variant="outline" className=" bg-transparent" >
                    <MenuIcon />
                </Button>
            </SheetTrigger>

            <SheetContent>
               <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
               </SheetHeader>

                {data?.user ?  (
                <div className="flex justify-between pt-6">
                    <div className="flex items-center gap-3">
                        <Avatar>
                                <AvatarImage src={data?.user?.image as string} />
                                <AvatarFallback>
                                {data.user?.name?.split("")[0][0]}
                                    {data.user?.name?.split("")[1][0]}
                                </AvatarFallback>
                        </Avatar>
                            <div>
                                <h3 className=" font-semibold">{data.user.name}</h3>
                                <span className=" text-muted-foreground text-xs">{data.user.email}</span>
                            </div>
                    </div>

                </div>
                ): (
                    <>
                    <div className="flex justify-between items-center pt-10">
                        <h2>Faça seu login</h2>
                        <Button size="icon" onClick={() => signIn()}>
                            <LogInIcon />
                        </Button>
                    </div>
                    </>
                )}
            <div className="py-6">
                <Separator />
            </div>
            {data?.user && (
                <>                
                    <div className=" space-y-2">
                        <Button variant="ghost" className="space-x-3 w-full justify-start text-sm font-normal">
                            <HomeIcon />
                            <span className=" block">inicio</span>
                        </Button>

                        <Button variant="ghost" 
                        className="space-x-3 w-full justify-start text-sm font-normal"
                        asChild
                        >
                            <Link href={"/my-orders"}>                            
                                <ScrollTextIcon />
                                <span className=" block">Meus pedidos</span>
                            </Link>
                        </Button>

                        <Button variant="ghost" className="space-x-3 w-full justify-start text-sm font-normal">
                            <HeartIcon size={16} />
                            <span className=" block">Restaurantes Favoritos</span>
                        </Button>
                    </div>

                    <div className=" py-6">
                        <Separator />
                    </div>

                    <Button variant="ghost" 
                    className="space-x-3 w-full justify-start text-sm font-normal"
                    onClick={() => signOut()}
                    >
                            <LogOutIcon size={16} />
                            <span className=" block">Sair da conta</span>
                    </Button>
                </>            
            )}
            </SheetContent>
        </Sheet>
        
    </div> 

);
}
 
export default Header;