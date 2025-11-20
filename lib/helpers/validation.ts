import { BarcodePaymentSettings } from "../types/BarcodePaymentSettings";
import { IsPaymentParams, PaymentParams } from "../types/PaymentParams";
import { _pricePattern, MaxLengths, ValidationResult } from "./constants";
import { IntentCodes } from "./IntentCodes";
import { PaymentModels } from "./PaymentModels";
import { GetLength, StringNotDefinedOrEmpty } from "./stringHelpers";
import { isValidIBAN } from 'ibantools';

/**
 * Validates IBAN
 * @param {string} iban IBAN which needs to be checked 
 * @returns {boolean} true ako je IBAN ispravan
 */
export function IsIBANValid(iban: string):boolean {
    return(isValidIBAN(iban));
}

/**
 * Validates payment model
 * @param {string} paymentModel payment model
 * @returns {boolean}
 */
 export function IsPaymentModelValid(paymentModel: string):boolean {
    return (PaymentModels.find((value) => value.model === paymentModel) !== undefined);
}

/**
 * (not implemented) Validates callout number
 * @param calloutNumber callout number
 * @param paymentModel model number
 * @returns 
 */
 export function IsCalloutNumberValid(calloutNumber: string, paymentModel: string):boolean {
    // TODO: Implement callout number validation by model
    // https://www.fina.hr/documents/52450/238316/Jedinstveni-pregled-osnovnih-modela-poziva-na-broj_4.8.2018.pdf/501b565f-8984-2441-ffb6-e5ec1b1fd3bf
    return true;
}

/**
 * Validira kod namjene
 * @param {string} intentCode kod namjene koji treba validirati 
 * @returns {boolean}
 */
 export function IsIntentCodeValid(intentCode: string):boolean {
    return (IntentCodes.find((value) => value.code === intentCode) !== undefined);
}

/**
 * Validira sve parametre plaćanja
 * @param {PaymentParams} paymentParams parametri koje treba validirati
 * @returns {boolean}
 */
export function ValidatePaymentParams(paymentParams: PaymentParams, settings:BarcodePaymentSettings):ValidationResult {
    if (!(IsPaymentParams(paymentParams))) {
        return null;
    }

    let result: ValidationResult = ValidationResult.OK;
    let fieldLength: number = -1;

    // Price
    fieldLength = GetLength(paymentParams.Iznos);
    if (fieldLength > MaxLengths.Price) {
        result |= ValidationResult.PriceMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.Iznos) || (fieldLength == -1 || paymentParams.Iznos.match(_pricePattern) == null)) {
        result |= ValidationResult.PricePatternInvalid;
    }

    // Payer name
    fieldLength = GetLength(paymentParams.ImePlatitelja);
    if (fieldLength > MaxLengths.PayerName) {
        result |= ValidationResult.PayerNameMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.ImePlatitelja) || fieldLength == -1) {
        result |= ValidationResult.PayerNameInvalid;
    }

    // Payer address
    fieldLength = GetLength(paymentParams.AdresaPlatitelja);
    if (fieldLength > MaxLengths.PayerAddress) {
        result |= ValidationResult.PayerAddressMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.AdresaPlatitelja) || fieldLength == -1) {
        result |= ValidationResult.PayerAddressInvalid;
    }

    // Payer HQ
    fieldLength = GetLength(paymentParams.SjedistePlatitelja);
    if (fieldLength > MaxLengths.PayerHQ) {
        result |= ValidationResult.PayerHQMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.SjedistePlatitelja) || fieldLength == -1) {
        result |= ValidationResult.PayerHQInvalid;
    }

    // Receiver name
    fieldLength = GetLength(paymentParams.Primatelj);
    if (fieldLength > MaxLengths.ReceiverName) {
        result |= ValidationResult.ReceiverNameMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.Primatelj) || fieldLength == -1) {
        result |= ValidationResult.ReceiverNameInvalid;
    }

    // Receiver address
    fieldLength = GetLength(paymentParams.AdresaPrimatelja);
    if (fieldLength > MaxLengths.ReceiverAddress) {
        result |= ValidationResult.ReceiverAddressMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.AdresaPrimatelja) || fieldLength == -1) {
        result |= ValidationResult.ReceiverAddressInvalid;
    }

    // Receiver HQ
    fieldLength = GetLength(paymentParams.SjedistePrimatelja);
    if (fieldLength > MaxLengths.ReceiverHQ) {
        result |= ValidationResult.ReceiverHQMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.SjedistePrimatelja) || fieldLength == -1) {
        result |= ValidationResult.ReceiverHQInvalid;
    }

    // IBAN
    fieldLength = GetLength(paymentParams.IBAN);
    if (fieldLength > MaxLengths.IBAN) {
        result |= ValidationResult.IBANMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.IBAN) || fieldLength == -1) {
        result |= ValidationResult.IBANInvalid;
    }

    if (settings.ValidateIBAN && !StringNotDefinedOrEmpty(paymentParams.IBAN) && !IsIBANValid(paymentParams.IBAN)) {
        result |= ValidationResult.IBANInvalid;
    }

    // Payment model
    fieldLength = GetLength(paymentParams.ModelPlacanja);
    if (fieldLength > MaxLengths.PaymentModel) {
        result |= ValidationResult.PaymentModelMaxLengthExceeded;
    }

    if (!StringNotDefinedOrEmpty(paymentParams.ModelPlacanja) && fieldLength == -1) {
        result |= ValidationResult.PaymentModelInvalid;
    }

    if (!StringNotDefinedOrEmpty(paymentParams.ModelPlacanja) && !IsPaymentModelValid(paymentParams.ModelPlacanja)) {
        result |= ValidationResult.PaymentModelInvalid;
    }

    // Callout number
    fieldLength = GetLength(paymentParams.PozivNaBroj);
    if (fieldLength > MaxLengths.CalloutNumber) {
        result |= ValidationResult.CalloutNumberMaxLengthExceeded;
    }

    if (!StringNotDefinedOrEmpty(paymentParams.PozivNaBroj) && fieldLength == -1) {
        result |= ValidationResult.CalloutNumberInvalid;
    }

    if (settings.ValidateCalloutNumber && !StringNotDefinedOrEmpty(paymentParams.PozivNaBroj) && !IsCalloutNumberValid(paymentParams.PozivNaBroj, paymentParams.ModelPlacanja)) {
        result |= ValidationResult.CalloutNumberInvalid;
    }

    // Intent code
    fieldLength = GetLength(paymentParams.SifraNamjene);
    if (fieldLength > MaxLengths.IntentCode) {
        result |= ValidationResult.IntentCodeMaxLengthExceeded;
    }

    if (!StringNotDefinedOrEmpty(paymentParams.SifraNamjene) && fieldLength == -1) {
        result |= ValidationResult.IntentCodeInvalid;
    }

    if (!StringNotDefinedOrEmpty(paymentParams.SifraNamjene) && !IsIntentCodeValid(paymentParams.SifraNamjene)) {
        result |= ValidationResult.IntentCodeInvalid;
    }

    // Description
    fieldLength = GetLength(paymentParams.OpisPlacanja);
    if (fieldLength > MaxLengths.Description) {
        result |= ValidationResult.DescriptionMaxLengthExceeded;
    }

    if (StringNotDefinedOrEmpty(paymentParams.OpisPlacanja) || fieldLength == -1) {
        result |= ValidationResult.DescriptionInvalid;
    }

    return result;
}
