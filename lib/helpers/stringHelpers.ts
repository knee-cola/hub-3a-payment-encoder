import { _allowedSingleByteCharacters, _allowedTwoByteCharacters } from "./constants";

/**
 * Utility function: calculates byte length of UTF-8 string
 * @param {string} str string which length is to be determined
 * @returns {number} length of a string
 */
export const GetLength:(str:string)=>number = (str:string) => {
    let len = 0;
    
    if (!StringNotDefinedOrEmpty(str)) {
        for (let i = 0; i < str.length; ++i) {
            let c = str[i];
            
            if (_allowedTwoByteCharacters.indexOf(c) !== -1) {
                len += 2;
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