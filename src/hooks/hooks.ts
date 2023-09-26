import { useDispatch } from "react-redux";
import CodePayload from "../model/CodePayload";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import Contact from "../model/Contact";
import { chatRoomService } from "../config/service-config";

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

export function useSelectorContacts() {
    const dispatch = useDispatchCode();
    const [contacts, setContacts] = useState<Contact[]>([]);
    useEffect(() => {
        const subscription: Subscription = chatRoomService.getAllContacts()
            .subscribe({
                next(contArray: Contact[] | string) {
                    let errorMessage: string = '';
                    if (typeof contArray === 'string') {
                        errorMessage = contArray;
                    } else {
                        setContacts(contArray);
                    }
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return contacts;
}