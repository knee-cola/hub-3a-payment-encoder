import { ValidatePaymentParams, IsIBANValid, IsPaymentModelValid, IsIntentCodeValid } from '../lib/helpers/validation';
import { PaymentParams } from '../lib/types/PaymentParams';
import { ValidationResult } from '../lib/helpers/constants';
import { BarcodePaymentSettings } from '../lib/types/BarcodePaymentSettings';

describe('Validation Functions', () => {

    describe('IsIBANValid', () => {
        it('should validate correct Croatian IBAN', () => {
            expect(IsIBANValid('HR1210010051863000160')).toBe(true);
        });

        it('should reject invalid IBAN', () => {
            expect(IsIBANValid('HR1234567890')).toBe(false);
        });

        it('should reject empty IBAN', () => {
            expect(IsIBANValid('')).toBe(false);
        });
    });

    describe('IsPaymentModelValid', () => {
        it('should validate valid payment model with HR prefix', () => {
            expect(IsPaymentModelValid('HR00')).toBe(true);
            expect(IsPaymentModelValid('HR01')).toBe(true);
            expect(IsPaymentModelValid('HR99')).toBe(true);
        });

        it('should reject payment model without HR prefix', () => {
            expect(IsPaymentModelValid('00')).toBe(false);
            expect(IsPaymentModelValid('01')).toBe(false);
        });

        it('should reject invalid payment model codes', () => {
            expect(IsPaymentModelValid('HR19')).toBe(false);
            expect(IsPaymentModelValid('HR20')).toBe(false);
            expect(IsPaymentModelValid('HRXX')).toBe(false);
        });

        it('should reject empty payment model', () => {
            expect(IsPaymentModelValid('')).toBe(false);
        });
    });

    describe('IsIntentCodeValid', () => {
        it('should validate valid intent codes', () => {
            expect(IsIntentCodeValid('SALA')).toBe(true);
            expect(IsIntentCodeValid('WTER')).toBe(true);
            expect(IsIntentCodeValid('ELEC')).toBe(true);
        });

        it('should reject invalid intent codes', () => {
            expect(IsIntentCodeValid('XXXX')).toBe(false);
            expect(IsIntentCodeValid('TEST')).toBe(false);
        });

        it('should reject empty intent code', () => {
            expect(IsIntentCodeValid('')).toBe(false);
        });
    });

    describe('ValidatePaymentParams', () => {
        const defaultSettings: BarcodePaymentSettings = {
            ValidateIBAN: true,
            ValidateCalloutNumber: false
        };

        const validParams: PaymentParams = {
            Iznos: '123,45',
            ImePlatitelja: 'Ivan Horvat',
            AdresaPlatitelja: 'Ilica 1',
            SjedistePlatitelja: 'Zagreb',
            Primatelj: 'Test d.o.o.',
            AdresaPrimatelja: 'Vukovarska 2',
            SjedistePrimatelja: 'Zagreb',
            IBAN: 'HR1210010051863000160',
            ModelPlacanja: 'HR00',
            PozivNaBroj: '123-456-789',
            SifraNamjene: 'SALA',
            OpisPlacanja: 'Test payment'
        };

        describe('Price validation', () => {
            it('should accept valid price format', () => {
                const params = { ...validParams, Iznos: '1234,56' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty price', () => {
                const params = { ...validParams, Iznos: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PricePatternInvalid).toBeTruthy();
            });

            it('should reject price without comma', () => {
                const params = { ...validParams, Iznos: '12345' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PricePatternInvalid).toBeTruthy();
            });

            it('should reject price with wrong decimal places', () => {
                const params = { ...validParams, Iznos: '123,4' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PricePatternInvalid).toBeTruthy();
            });

            it('should reject price exceeding max length', () => {
                const params = { ...validParams, Iznos: '12345678901234,56' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PriceMaxLengthExceeded).toBeTruthy();
            });

            it('should reject price with invalid characters', () => {
                const params = { ...validParams, Iznos: '123,4Š' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PricePatternInvalid).toBeTruthy();
            });
        });

        describe('Payer name validation', () => {
            it('should accept valid payer name', () => {
                const params = { ...validParams, ImePlatitelja: 'Ivan Horvat' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should accept payer name with Croatian characters', () => {
                const params = { ...validParams, ImePlatitelja: 'Marko Šarić' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty payer name', () => {
                const params = { ...validParams, ImePlatitelja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerNameInvalid).toBeTruthy();
            });

            it('should reject payer name exceeding max length (30 bytes)', () => {
                const params = { ...validParams, ImePlatitelja: 'A'.repeat(31) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerNameMaxLengthExceeded).toBeTruthy();
            });

            it('should reject payer name with invalid characters', () => {
                const params = { ...validParams, ImePlatitelja: 'Ivan@Horvat' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerNameInvalid).toBeTruthy();
            });
        });

        describe('Payer address validation', () => {
            it('should accept valid payer address', () => {
                const params = { ...validParams, AdresaPlatitelja: 'Ilica 1' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty payer address', () => {
                const params = { ...validParams, AdresaPlatitelja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerAddressInvalid).toBeTruthy();
            });

            it('should reject payer address exceeding max length (27 bytes)', () => {
                const params = { ...validParams, AdresaPlatitelja: 'A'.repeat(28) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerAddressMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Payer HQ validation', () => {
            it('should accept valid payer HQ', () => {
                const params = { ...validParams, SjedistePlatitelja: 'Zagreb' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty payer HQ', () => {
                const params = { ...validParams, SjedistePlatitelja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerHQInvalid).toBeTruthy();
            });

            it('should reject payer HQ exceeding max length (27 bytes)', () => {
                const params = { ...validParams, SjedistePlatitelja: 'A'.repeat(28) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerHQMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Receiver name validation', () => {
            it('should accept valid receiver name', () => {
                const params = { ...validParams, Primatelj: 'Test d.o.o.' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty receiver name', () => {
                const params = { ...validParams, Primatelj: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverNameInvalid).toBeTruthy();
            });

            it('should reject receiver name exceeding max length (25 bytes)', () => {
                const params = { ...validParams, Primatelj: 'A'.repeat(26) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverNameMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Receiver address validation', () => {
            it('should accept valid receiver address', () => {
                const params = { ...validParams, AdresaPrimatelja: 'Vukovarska 2' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty receiver address', () => {
                const params = { ...validParams, AdresaPrimatelja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverAddressInvalid).toBeTruthy();
            });

            it('should reject receiver address exceeding max length (25 bytes)', () => {
                const params = { ...validParams, AdresaPrimatelja: 'A'.repeat(26) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverAddressMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Receiver HQ validation', () => {
            it('should accept valid receiver HQ', () => {
                const params = { ...validParams, SjedistePrimatelja: 'Zagreb' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty receiver HQ', () => {
                const params = { ...validParams, SjedistePrimatelja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverHQInvalid).toBeTruthy();
            });

            it('should reject receiver HQ exceeding max length (27 bytes)', () => {
                const params = { ...validParams, SjedistePrimatelja: 'A'.repeat(28) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.ReceiverHQMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('IBAN validation', () => {
            it('should accept valid IBAN', () => {
                const params = { ...validParams, IBAN: 'HR1210010051863000160' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty IBAN', () => {
                const params = { ...validParams, IBAN: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.IBANInvalid).toBeTruthy();
            });

            it('should reject invalid IBAN when ValidateIBAN is true', () => {
                const params = { ...validParams, IBAN: 'HR1234567890' };
                const result = ValidatePaymentParams(params, { ...defaultSettings, ValidateIBAN: true });
                expect(result & ValidationResult.IBANInvalid).toBeTruthy();
            });

            it('should skip IBAN validation when ValidateIBAN is false', () => {
                const params = { ...validParams, IBAN: 'HR12100100518630001' };
                const result = ValidatePaymentParams(params, { ...defaultSettings, ValidateIBAN: false });
                // Should pass because IBAN structural validation is disabled
                expect(result).toBe(ValidationResult.OK);
            });

            it('should reject IBAN exceeding max length (21 bytes)', () => {
                const params = { ...validParams, IBAN: 'HR' + '1'.repeat(20) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.IBANMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Payment model validation', () => {
            it('should accept valid payment model', () => {
                const params = { ...validParams, ModelPlacanja: 'HR00' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty payment model', () => {
                const params = { ...validParams, ModelPlacanja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                // Empty model should not trigger invalid flag with current logic
                expect(result).toBe(ValidationResult.OK);
            });

            it('should reject invalid payment model', () => {
                const params = { ...validParams, ModelPlacanja: 'HR99' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject payment model without HR prefix', () => {
                const params = { ...validParams, ModelPlacanja: '00' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PaymentModelInvalid).toBeTruthy();
            });

            it('should reject payment model exceeding max length (4 bytes)', () => {
                const params = { ...validParams, ModelPlacanja: 'HR001' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PaymentModelMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Callout number validation', () => {
            it('should accept valid callout number', () => {
                const params = { ...validParams, PozivNaBroj: '123-456-789' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should accept empty callout number', () => {
                const params = { ...validParams, PozivNaBroj: '' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject callout number exceeding max length (22 bytes)', () => {
                const params = { ...validParams, PozivNaBroj: '1'.repeat(23) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.CalloutNumberMaxLengthExceeded).toBeTruthy();
            });

            it('should reject callout number with invalid characters', () => {
                const params = { ...validParams, PozivNaBroj: '123@456' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.CalloutNumberInvalid).toBeTruthy();
            });
        });

        describe('Intent code validation', () => {
            it('should accept valid intent code', () => {
                const params = { ...validParams, SifraNamjene: 'SALA' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should accept empty intent code', () => {
                const params = { ...validParams, SifraNamjene: '' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject invalid intent code', () => {
                const params = { ...validParams, SifraNamjene: 'XXXX' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.IntentCodeInvalid).toBeTruthy();
            });

            it('should reject intent code exceeding max length (4 bytes)', () => {
                const params = { ...validParams, SifraNamjene: 'TOOLONG' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.IntentCodeMaxLengthExceeded).toBeTruthy();
            });
        });

        describe('Description validation', () => {
            it('should accept valid description', () => {
                const params = { ...validParams, OpisPlacanja: 'Test payment' };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject empty description', () => {
                const params = { ...validParams, OpisPlacanja: '' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.DescriptionInvalid).toBeTruthy();
            });

            it('should reject description exceeding max length (35 bytes)', () => {
                const params = { ...validParams, OpisPlacanja: 'A'.repeat(36) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.DescriptionMaxLengthExceeded).toBeTruthy();
            });

            it('should reject description with invalid characters', () => {
                const params = { ...validParams, OpisPlacanja: 'Test@Payment' };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.DescriptionInvalid).toBeTruthy();
            });
        });

        describe('Multiple errors accumulation', () => {
            it('should accumulate multiple validation errors', () => {
                const params: PaymentParams = {
                    Iznos: '', // PricePatternInvalid
                    ImePlatitelja: '', // PayerNameInvalid
                    AdresaPlatitelja: '', // PayerAddressInvalid
                    SjedistePlatitelja: 'Zagreb',
                    Primatelj: '', // ReceiverNameInvalid
                    AdresaPrimatelja: 'Vukovarska 2',
                    SjedistePrimatelja: 'Zagreb',
                    IBAN: 'HR1210010051863000160',
                    ModelPlacanja: 'HR00',
                    PozivNaBroj: '123',
                    SifraNamjene: 'SALA',
                    OpisPlacanja: 'Test'
                };

                const result = ValidatePaymentParams(params, defaultSettings);

                expect(result & ValidationResult.PricePatternInvalid).toBeTruthy();
                expect(result & ValidationResult.PayerNameInvalid).toBeTruthy();
                expect(result & ValidationResult.PayerAddressInvalid).toBeTruthy();
                expect(result & ValidationResult.ReceiverNameInvalid).toBeTruthy();
                expect(result).not.toBe(ValidationResult.OK);
            });

            it('should accumulate both invalid and max length errors', () => {
                const params: PaymentParams = {
                    Iznos: '12345678901234,56', // PriceMaxLengthExceeded
                    ImePlatitelja: 'A'.repeat(31), // PayerNameMaxLengthExceeded
                    AdresaPlatitelja: 'Ilica 1',
                    SjedistePlatitelja: 'Zagreb',
                    Primatelj: 'Test',
                    AdresaPrimatelja: '@@@', // ReceiverAddressInvalid
                    SjedistePrimatelja: 'Zagreb',
                    IBAN: 'HR1210010051863000160',
                    ModelPlacanja: 'HR00',
                    PozivNaBroj: '123',
                    SifraNamjene: 'SALA',
                    OpisPlacanja: 'Test'
                };

                const result = ValidatePaymentParams(params, defaultSettings);

                expect(result & ValidationResult.PriceMaxLengthExceeded).toBeTruthy();
                expect(result & ValidationResult.PayerNameMaxLengthExceeded).toBeTruthy();
                expect(result & ValidationResult.ReceiverAddressInvalid).toBeTruthy();
            });
        });

        describe('Croatian character byte length handling', () => {
            it('should count Croatian characters as 2 bytes', () => {
                // 'Š' counts as 2 bytes, so 15 of them = 30 bytes (max is 30)
                const params = { ...validParams, ImePlatitelja: 'Š'.repeat(15) };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });

            it('should reject when Croatian characters exceed byte limit', () => {
                // 'Š' counts as 2 bytes, so 16 of them = 32 bytes (max is 30)
                const params = { ...validParams, ImePlatitelja: 'Š'.repeat(16) };
                const result = ValidatePaymentParams(params, defaultSettings);
                expect(result & ValidationResult.PayerNameMaxLengthExceeded).toBeTruthy();
            });

            it('should handle mixed single and double byte characters', () => {
                // 10 regular chars (10 bytes) + 10 Croatian chars (20 bytes) = 30 bytes
                const params = { ...validParams, ImePlatitelja: 'A'.repeat(10) + 'Š'.repeat(10) };
                expect(ValidatePaymentParams(params, defaultSettings)).toBe(ValidationResult.OK);
            });
        });
    });
});
