/** UTF-8 characters stored into single byte  */
export const _allowedSingleByteCharacters:Array<string> = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", ",", ".", ":", "-", "+", "?", "'", "/", "(", ")" ]
/** UTF-8 characters stored into two bytes  */
export const _allowedTwoByteCharacters:Array<string> = [ "Š", "Đ", "Č", "Ć", "Ž", "š", "đ", "č", "ć", "ž" ]
/** all allowed characters  */
export const _allowedCharacters:Array<string> = [ ..._allowedSingleByteCharacters,  ..._allowedTwoByteCharacters ];

export const _priceFieldLength:number = 15;
export const _pricePattern:string = "^[0-9]+,[0-9]{2}$";

export const _delimiter:string = String.fromCharCode(0x0A);
export const _header:string = "HRVHUB30";
export const _currency:string = "EUR"
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
    PaymentModel: 4,
    CalloutNumber: 22,
    IntentCode: 4,
    Description: 35
};

export enum ValidationResult {
    OK = 0,

    InvalidPaymentParams = 1,

    PricePatternInvalid = 2,
    PriceMaxLengthExceeded = 4,

    PayerNameInvalid = 8,
    PayerNameMaxLengthExceeded = 16,

    PayerAddressInvalid = 32,
    PayerAddressMaxLengthExceeded = 64,

    PayerHQInvalid = 128,
    PayerHQMaxLengthExceeded = 256,

    ReceiverNameInvalid = 512,
    ReceiverNameMaxLengthExceeded = 1024,

    ReceiverAddressInvalid = 2048,
    ReceiverAddressMaxLengthExceeded = 4096,

    ReceiverHQInvalid = 8192,
    ReceiverHQMaxLengthExceeded = 16384,

    IBANInvalid = 32768,
    IBANMaxLengthExceeded = 65536,

    PaymentModelInvalid = 131072,
    PaymentModelMaxLengthExceeded = 262144,

    CalloutNumberInvalid = 524288,
    CalloutNumberMaxLengthExceeded = 1048576,

    IntentCodeInvalid = 2097152,
    IntentCodeMaxLengthExceeded = 4194304,

    DescriptionInvalid = 8388608,
    DescriptionMaxLengthExceeded = 16777216
}
