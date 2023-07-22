import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { Product } from "../model/Product";
import { authService, ordersService, productsService } from "../config/service-config";
import { PickedProduct } from "../model/PickedProduct";
import UserData from "../model/UserData";
import { useSelectorAuth } from "../redux/store";
import { Order } from "../model/Order";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        if (error) { //for dispatching OK messages (don't let them go to the else (so I pass error like ''))
            if (error.includes('Authentication')) {
                code = CodeType.AUTH_ERROR;
                message = "Authentication error, mooving to Sign In";
            } else { //
                code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
                message = error;
            }
        }
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}
export function useSelectorProducts() {
    const dispatch = useDispatchCode();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const subscription: Subscription = productsService.getProducts()
            .subscribe({
                next(prodArray: Product[] | string) {
                    let errorMessage: string = '';
                    if (typeof prodArray === 'string') {
                        errorMessage = prodArray;
                    } else {
                        setProducts(prodArray);
                    }
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return products;
}
export function useSelectorCart() {
    const dispatch = useDispatchCode();
    const userData: UserData = useSelectorAuth()
    const [cart, setCart] = useState<PickedProduct[]>([]);
    useEffect(() => {
        if (userData) {
            const subscription: Subscription = ordersService.getShoppingCart(userData.email)
                .subscribe({
                    next(prodArray: PickedProduct[] | string) {
                        let errorMessage: string = '';
                        if (typeof prodArray === 'string') {
                            errorMessage = prodArray;
                        } else {
                            setCart(prodArray);
                        }
                        dispatch(errorMessage, '')
                    }
                });
            return () => subscription.unsubscribe();
        }
    }, [])
    return cart
}
export function useSelectorOrders() {
    const dispatch = useDispatchCode();
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const subscription: Subscription = ordersService.getOrders()
            .subscribe({
                next(ordersArray: Order[] | string) {
                    let errorMessage: string = '';
                    if (typeof ordersArray === 'string') {
                        errorMessage = ordersArray;
                    } else {
                        setOrders(ordersArray);
                    }
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, [])
    return orders
}
export function useSelectorUsers() {
    const dispatch = useDispatchCode();
    const [users, setUsers] = useState<UserData[]>([]);
    useEffect(() => {
        const subscription: Subscription = authService.getUsers()
            .subscribe({
                next(usersArray: UserData[] | string) {
                    let errorMessage: string = ''
                    if (typeof usersArray === 'string') {
                        errorMessage = usersArray
                    } else {
                        setUsers(usersArray);
                    }
                    dispatch(errorMessage, '')
                }
            });
        return () => subscription.unsubscribe();
    }, [])
    return users
}

