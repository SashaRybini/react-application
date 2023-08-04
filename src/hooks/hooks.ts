import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        if (error) {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}