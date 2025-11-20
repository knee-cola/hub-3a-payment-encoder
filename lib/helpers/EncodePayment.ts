import { ValidationResult, _currency, _delimiter, _header, _paymentModelPrefix } from "./constants";
import { ConcatenateStrings, EncodePrice } from "./stringHelpers";
import { ValidatePaymentParams } from "./validation";
import { BarcodePaymentSettings } from "../types/BarcodePaymentSettings";
import { IsPaymentParams, PaymentParams } from "../types/PaymentParams";

/**
 * Encodes playment parameters into HUB 3A compatible text format used in 2D bar codes
 * @param paymentParams all the info related to payment
 * @param settings settings
 * @returns 
 */
export function EncodePayment(paymentParams:PaymentParams, settings:Partial<BarcodePaymentSettings> = {}):string {

	if (!(IsPaymentParams(paymentParams))) {
		throw new Error(`invalid payment params object`)
	}

	const validationResult = ValidatePaymentParams(paymentParams, {
		// default settings values
		ValidateIBAN: true,
		ValidateCalloutNumber: false,
		...settings,
	});

	if (validationResult != ValidationResult.OK) {
		throw new Error(`param validation failed with code ${validationResult}`)
	}

	return ConcatenateStrings(
		_header, _delimiter,
		_currency, _delimiter,
		EncodePrice(paymentParams.Iznos), _delimiter,
		paymentParams.ImePlatitelja, _delimiter,
		paymentParams.AdresaPlatitelja, _delimiter,
		paymentParams.SjedistePlatitelja, _delimiter,
		paymentParams.Primatelj, _delimiter,
		paymentParams.AdresaPrimatelja, _delimiter,
		paymentParams.SjedistePrimatelja, _delimiter,
		paymentParams.IBAN, _delimiter,
		paymentParams.ModelPlacanja, _delimiter,
		paymentParams.PozivNaBroj, _delimiter,
		paymentParams.SifraNamjene, _delimiter,
		paymentParams.OpisPlacanja, _delimiter
	);
};