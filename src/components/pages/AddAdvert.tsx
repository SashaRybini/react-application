import Advert from "../../model/Advert"
import { AdvertForm } from "../forms/AdvertForm"

const AddAdvert: React.FC = () => {

    function submitFn(advert: Advert) {
        console.log(advert)
    }
    
    return <AdvertForm submitFn={submitFn} />
}
export default AddAdvert