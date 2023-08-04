import Advert from "../../model/Advert"
import { AdvertForm } from "../forms/AdvertForm"
import { advertsService } from "../../config/service-config"
import { useDispatchCode } from "../../hooks/hooks"

const AddAdvert: React.FC = () => {

    const dispatch = useDispatchCode()
    
    async function submitFn(adv: Advert) {
        try {
            const res: string = await advertsService.addAdvert(adv)
            dispatch('', res)
        } catch (error: any) {
            dispatch(error, '')
        }
    }
    
    return <AdvertForm submitFn={submitFn} />
}
export default AddAdvert