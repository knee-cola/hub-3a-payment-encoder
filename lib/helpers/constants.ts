/** UTF-8 characters stored into single byte  */
export const _allowedSingleByteCharacters:Array<string> = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", ",", ".", ":", "-", "+", "?", "'", "/", "(", ")" ]
/** UTF-8 characters stored into two bytes  */
export const _allowedTwoByteCharacters:Array<string> = [ "Š", "Đ", "Č", "Ć", "Ž", "š", "đ", "č", "ć", "ž" ]
/** all allowed characters  */
export const _allowedCharacters:Array<string> = { ..._allowedSingleByteCharacters,  ..._allowedTwoByteCharacters }

export const _priceFieldLength:number = 15;
export const _pricePattern:string = "^[0-9]+,[0-9]{2}$";

export const _delimiter:string = String.fromCharCode(0x0A);
export const _header:string = "HRVHUB30";
export const _currency:string = "HRK"
export const _paymentModelPrefix:string = "HR";

export const MaxLengths = {
    Price: 16,
    PayerName: 30,
    PayerAddress: 27,
    PayerHQ: 27,
    ReceiverName: 25,
    ReceiverAddress: 25,
    ReceiverHQ: 27,
    IBAN: 21,
    PaymentModel: 2,
    CalloutNumber: 22,
    IntentCode: 4,
    Description: 35
};

export enum ValidationResult {
    OK = 0,
    
    PricePatternInvalid = 1,
    PriceMaxLengthExceeded = 2,
    
    PayerNameInvalid = 4,
    PayerNameMaxLengthExceeded = 8,
    
    PayerAddressInvalid = 16,
    PayerAddressMaxLengthExceeded = 32,
    
    PayerHQInvalid = 64,
    PayerHQMaxLengthExceeded = 128,
    
    ReceiverNameInvalid = 256,
    ReceiverNameMaxLengthExceeded = 512,
    
    ReceiverAddressInvalid = 1024,
    ReceiverAddressMaxLengthExceeded = 2048,
    
    ReceiverHQInvalid = 4096,
    ReceiverHQMaxLengthExceeded = 8192,
    
    IBANInvalid = 16384,
    IBANMaxLengthExceeded = 32768,
    
    PaymentModelInvalid = 65536,
    PaymentModelMaxLengthExceeded = 131072,
    
    CalloutNumberInvalid = 262144,
    CalloutNumberMaxLengthExceeded = 524288,
    
    IntentCodeInvalid = 1048576,
    IntentCodeMaxLengthExceeded = 2097152,
    
    DescriptionInvalid = 4194304,
    DescriptionMaxLengthExceeded = 8388608
}
