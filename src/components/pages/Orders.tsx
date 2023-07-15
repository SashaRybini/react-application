import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { Order } from "../../model/Order";
import { ordersService } from "../../config/service-config";

const Orders: React.FC = () => {

    //code below TODO move to useSelectorCart in hooks
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const subscription: Subscription = ordersService.getOrders()
            .subscribe({
                next(ordersArray: Order[]) {
                    setOrders(ordersArray);
                }
            });
        return () => subscription.unsubscribe();
    }, [])

    console.log(orders)

    return <Box>
        <Typography> 
            {orders.map(o => o.cart.map(c => c.id + ' '))}
        </Typography>
    </Box>
}
export default Orders