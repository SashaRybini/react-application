import Advert from "../../model/Advert"
import { AdvertForm } from "../forms/AdvertForm"
import { advertsService } from "../../config/service-config"
import { useDispatchCode } from "../../hooks/hooks"

const AddAdvert: React.FC = () => {

    const dispatch = useDispatchCode()
    
    async function submitFn(adv: Advert) {
        // const adv: Advert = await advertsService.addAdvert(advert)
        try {
            const res: string = await advertsService.addAdvert(adv)
            console.log(res)
            // dispatch('', `advert: ${advert.name} with id ${advert.id} has been added`)
            dispatch('', res)
        } catch (error: any) {
            console.log(error)
            dispatch(error, '')
        }
    }
    
    return <AdvertForm submitFn={submitFn} />
}
export default AddAdvert