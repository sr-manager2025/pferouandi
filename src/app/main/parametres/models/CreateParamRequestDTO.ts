import {ParamType} from './param-type';

export class CreateParamRequestDTO {
      username: string;
      intitule: string;
      symbole: string;
      description: string;
      string1: string;
      string2: string;
      string3: string;
      string4: string;
      string5: string;
      defaultValue: boolean;
      paramType: ParamType;


      constructor(username: string, intitule: string, symbole: string, description: string, string1: string, string2: string, string3: string, string4: string, string5: string, paramType: ParamType) {
            this.username = username;
            this.intitule = intitule;
            this.symbole = symbole;
            this.description = description;
            this.string1 = string1;
            this.string2 = string2;
            this.string3 = string3;
            this.string4 = string4;
            this.string5 = string5;
            this.defaultValue = false;
            this.paramType = paramType;
      }
}
