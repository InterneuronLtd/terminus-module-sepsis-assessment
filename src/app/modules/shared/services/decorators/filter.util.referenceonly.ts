//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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

// export const optionTypeMetadataKey = Symbol("optionTypeList");
// //var Reflect = global['Reflect'];

// // export function optionType1(optionText: string) {
// //     return Reflect.defineMetadata(optionTypeMetadataKey, optionText);
// // }

// export function optionType(optionText: string): (target: object, propertyKey: string) => void {
//     return (target: object, propertyKey: string) => {
//         //const Reflect = global['Reflect'];

//         // // get the list from the class containing the properties that have already registered
//         // let list: Array<string> = Reflect.getMetadata(optionTypeMetadataKey, target)
//         // if (!list)
//         //     list = []

//         // // Add the property name to the array
//         // list.push(propertyKey)

//         // // Add the updated list to the class
//         // Reflect.defineMetadata(optionTypeMetadataKey, list, target)

//         Reflect.defineMetadata(optionTypeMetadataKey, optionText, target, propertyKey);

//     }
// }

// export function getAllOptionTypeProperties<T extends Object, K extends keyof T>(target: T, listAllInstantiated = false) {
//     //const Reflect = global['Reflect'];

//     // Get the array containing the decorated properties
//     let annotations = Reflect.getMetadata(optionTypeMetadataKey, target);

//     if (!annotations)
//         annotations = []

//     if (listAllInstantiated)
//         annotations.push(...Object.keys(target).filter(value => !annotations.contains(value)));

//     return annotations;
// }

// export function getOptionTextForProperty<T extends Object, K extends keyof T>(target: T, propertyKey) {

//     // Get the array containing the decorated properties
//     return Reflect.getMetadata(optionTypeMetadataKey, target, propertyKey);
// }


// // export const metadataKey1 = 'MyDecorator';

// // function MyDecorator(target, propertyKey) {
// //     console.log(`MyDecorator - propertyKey: ${propertyKey}`);
// //     const Reflect = global['Reflect'];
// //     Reflect.defineMetadata(metadataKey, true, target, propertyKey);
// // }

// // export function myDecoratorUsingClass<T>(type: Type<T>, propertyKey: string) {
// //     console.log(`myDecoratorUsingClass- propertyKey: ${propertyKey}`);
// //     const Reflect = global['Reflect'];
// //     return myDecoratorUsingInstance(new type(), propertyKey);
// // }

// // export function myDecoratorUsingInstance<T>(instance: T, propertyKey: string) {
// //     console.log(`myDecoratorUsingInstance - propertyKey: ${propertyKey}`);
// //     const Reflect = global['Reflect'];
// //     return !!Reflect.getMetadata(metadataKey, instance, propertyKey);
// // }


// const metadataKey = Symbol('isFilter');

// export function isFilter(): (target: object, propertyKey: string) => void {
//   return registerProperty;
// }

// function registerProperty(target: object, propertyKey: string): void {
//   let properties: string[] = Reflect.getMetadata(metadataKey, target);

//   console.log("Target is: ", target);

//   if (properties) {
//     properties.push(propertyKey);
//   } else {
//     properties = [propertyKey];
//     Reflect.defineMetadata(metadataKey, properties, target);
//   }
// }

// export function getFilteredProperties(origin: object): object {
//   const properties: string[] = Reflect.getMetadata(metadataKey, origin);
//   const result = {};
//   properties.forEach(key => result[key] = origin[key]);
//   return result;
// }

// export function getProperties(origin: object)
// {
//   return Reflect.getMetadata(metadataKey, origin);
// }