import {EnginRoute} from './EnginRoute';
import {Chauffeur} from '../../models/chauffeur';

export class EnginGpsLocation {
    id: number;
    groupName: string;
    imei: string;
    name: string;
    device: string;
    model: string;
    coutH: number;
    plateNumber: string;
    chauffeur: Chauffeur[];
    enginRoutes: EnginRoute[];
}
