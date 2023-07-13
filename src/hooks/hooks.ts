import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { Product } from "../model/Product";
import { productsService } from "../config/service-config";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        
        if (error) { //for dispatch OK messages
            if (error.includes('Authentication')) {
                code = CodeType.AUTH_ERROR;
                message = "Authentication error, mooving to Sign In";
            } else {
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
                        // setProducts(emplArray.map(e => ({ ...e, birthDate: new Date(e.birthDate) })));
                        setProducts(prodArray);
                    }
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return products;
}

