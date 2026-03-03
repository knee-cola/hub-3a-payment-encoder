import { _allowedSingleByteCharacters, _allowedTwoByteCharacters } from "./constants.js";

/**
 * Utility function: calculates byte length of a string according to allowed characters.
 * @param {string} str string which length is to be determined
 * @returns {number} length of a string
 * @description the length calculation counts the number of characters and NOT the number
 * of bytes required to store the string as specified in https://www.hub.hr/sites/default/files/inline-files/2dbc_0.pdf
 * ("Duljina polja definirana je kao najveći broj znakova u polju, ne kao broj bajtova (okteta).")
 */
export const GetLength:(str:string)=>number = (str:string) => {
    let len = 0;
    
    if (!StringNotDefinedOrEmpty(str)) {
        for (let i = 0; i < str.length; ++i) {
            let c = str[i];
            
            if (_allowedTwoByteCharacters.indexOf(c) !== -1) {
                len += 1;
            } else if (_allowedSingleByteCharacters.indexOf(c) !== -1) {
                len += 1;
            } else {
                return -1;
            }
        }
    }
    
    return len;
}

export const PadLeft = (str:string, len:number, pad:string):string => {
    while (str.length < len) {
        str = pad + str;
    }

    return str;
}

export const StringNotDefinedOrEmpty = (str: string | undefined | null):boolean => {
    return str === undefined || str === null || str.length == 0;
}

export const EncodePrice = (price:string):string => {
    const fullLength = 15;
    return PadLeft(price.replace(',', ''), fullLength, '0');
}

/**
 * Concatinates give list of string
 * @param {string[]} args list of strings
 * @returns
 */
export const ConcatenateStrings = (...args:Array<string | undefined>):string => {
    let res = '';

    for (var i = 0; i < args.length; ++i) {
        if (typeof(args[i]) != 'undefined') {
            res += args[i];
        }
    }

    return res;
}