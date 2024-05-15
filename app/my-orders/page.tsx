import { getSession } from "next-auth/react";
import { authOptions } from "../_lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import Header from "../_components/header";
import OrderItem from "./_componentes/order-item";

const MyOrdersPage = async() => {
    const session = await getServerSession(authOptions)

    if(!session?.user) {
        return redirect("/")
    } 

    const orders = await db.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            restaurant: true,
            products: {
                include: {
                    product: true
                }
            }
        },
    })
    return ( 
        <>
        <Header />

        <div className=" px-5 py-6">
             <h2 className=" pb-6 font-semibold text-lg">Meus Pedidos</h2>

             <div  className=" space-y-3">
                {orders.map((order) => (
                    <OrderItem  key={order.id} order={order}/>
                ))}
             </div>
        </div>

    
        </>
    );
}
 
export default MyOrdersPage;
