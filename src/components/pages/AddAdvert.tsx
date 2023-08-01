import Advert from "../../model/Advert"
import { AdvertForm } from "../forms/AdvertForm"
import { advertsService } from "../../config/service-config"
import { useDispatchCode } from "../../hooks/hooks"

const AddAdvert: React.FC = () => {

    const dispatch = useDispatchCode()
    
    async function submitFn(adv: Advert) {
        // const adv: Advert = await advertsService.addAdvert(advert)
        try {
            const advert: Advert = await advertsService.addAdvert(adv)
            console.log(advert)
            dispatch('', `advert: ${advert.name} with id ${advert.id} has been added`)
        } catch (error: any) {
            dispatch(error, '')
        }
    }
    
    return <AdvertForm submitFn={submitFn} />
}
export default AddAdvert