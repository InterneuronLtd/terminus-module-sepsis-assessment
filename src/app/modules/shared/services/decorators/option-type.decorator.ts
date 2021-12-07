//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2021  Interneuron CIC

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 

import 'reflect-metadata';

export const optionTypeMetadataKey = Symbol("optionTypeList");

export function optionType(data:{text: string, defVal: any}): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string) => {
        
        //Adding for individual property
        Reflect.defineMetadata(optionTypeMetadataKey, data, target, propertyKey);

        //Adding for the whole taget as well
        let properties: string[] = Reflect.getMetadata(optionTypeMetadataKey, target);

        if (properties) {
            properties.push(propertyKey);
        } else {
            properties = [propertyKey];
            Reflect.defineMetadata(optionTypeMetadataKey, properties, target);
        }
    }
}

export function getAllOptionTypeProperties<T extends Object, K extends keyof T>(target: T) {
    //const Reflect = global['Reflect'];

    // Get the array containing the decorated properties
    return Reflect.getMetadata(optionTypeMetadataKey, target);
}

export function getOptionTextForProperty<T extends Object, K extends keyof T>(target: T, propertyKey) {

    // Get the array containing the decorated properties
    return Reflect.getMetadata(optionTypeMetadataKey, target, propertyKey);
}