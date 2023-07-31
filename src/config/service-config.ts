import AdvertsService from "../service/AdvertsService";
import AdvertsServiceRest from "../service/AdvertsServiceRest";

export const advertsService: AdvertsService = new AdvertsServiceRest('http://localhost:8080/adverts')