import advertsConfig from "../../config/categories-config.json"
import { HousesForm } from "./HousesForm";
import { VehiclesForm } from "./VehiclesForm";
import { ElectricalForm } from "./ElectricalForm";
import { ReactNode } from "react";
import Advert from "../../model/Advert";

const categories = advertsConfig.categories;

export function getSubformComponent(
    category: string, 
    handlerDetails: (details: string) => void, 
    advertUpdated: Advert | undefined) {

    const components: Map<string, ReactNode> = new Map([
        [`${categories[0]}`, <HousesForm handlerDetails={handlerDetails} advertUpd={advertUpdated} />],
        [`${categories[1]}`, <VehiclesForm handlerDetails={handlerDetails} advertUpd={advertUpdated} />],
        [`${categories[2]}`, <ElectricalForm handlerDetails={handlerDetails} advertUpd={advertUpdated} />]
    ])
    
    return components.get(category)
}