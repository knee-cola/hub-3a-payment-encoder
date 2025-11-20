import { EncodePayment } from '../lib/helpers/EncodePayment';
import { PaymentParams } from '../lib/types/PaymentParams';
import { ValidationResult } from '../lib/helpers/constants';

describe('EncodePayment', () => {
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

    describe('Basic encoding', () => {
        it('should encode valid payment params', () => {
            const result = EncodePayment(validParams);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('should start with HRVHUB30 header', () => {
            const result = EncodePayment(validParams);
            expect(result.startsWith('HRVHUB30')).toBe(true);
        });

        it('should contain EUR currency code', () => {
            const result = EncodePayment(validParams);
            const lines = result.split('\n');
            expect(lines[1]).toBe('EUR');
        });

        it('should encode price with zero padding to 15 digits', () => {
            const params = { ...validParams, Iznos: '123,45' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[2]).toBe('000000000012345');
        });

        it('should encode large price correctly', () => {
            const params = { ...validParams, Iznos: '9999999999,99' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[2]).toBe('000999999999999');
        });

        it('should encode small price correctly', () => {
            const params = { ...validParams, Iznos: '0,01' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[2]).toBe('000000000000001');
        });

        it('should include payment model without additional prefix', () => {
            const params = { ...validParams, ModelPlacanja: 'HR00' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[10]).toBe('HR00');
        });

        it('should preserve all payment fields in correct order', () => {
            const result = EncodePayment(validParams);
            const lines = result.split('\n');

            expect(lines[0]).toBe('HRVHUB30');
            expect(lines[1]).toBe('EUR');
            expect(lines[2]).toBe('000000000012345');
            expect(lines[3]).toBe('Ivan Horvat');
            expect(lines[4]).toBe('Ilica 1');
            expect(lines[5]).toBe('Zagreb');
            expect(lines[6]).toBe('Test d.o.o.');
            expect(lines[7]).toBe('Vukovarska 2');
            expect(lines[8]).toBe('Zagreb');
            expect(lines[9]).toBe('HR1210010051863000160');
            expect(lines[10]).toBe('HR00');
            expect(lines[11]).toBe('123-456-789');
            expect(lines[12]).toBe('SALA');
            expect(lines[13]).toBe('Test payment');
            expect(lines[14]).toBe(''); // Trailing delimiter
        });
    });

    describe('Error handling', () => {
        it('should throw error for invalid object', () => {
            const invalidObj = { someField: 'value' } as any;
            expect(() => EncodePayment(invalidObj)).toThrow('invalid payment params object');
        });

        it('should throw error when validation fails - empty price', () => {
            const params = { ...validParams, Iznos: '' };
            expect(() => EncodePayment(params)).toThrow('param validation failed');
        });

        it('should throw error when validation fails - empty payer name', () => {
            const params = { ...validParams, ImePlatitelja: '' };
            expect(() => EncodePayment(params)).toThrow('param validation failed');
        });

        it('should throw error when validation fails - invalid IBAN', () => {
            const params = { ...validParams, IBAN: 'INVALID' };
            expect(() => EncodePayment(params, { ValidateIBAN: true })).toThrow('param validation failed');
        });

        it('should throw error when validation fails - invalid payment model', () => {
            const params = { ...validParams, ModelPlacanja: '00' };
            expect(() => EncodePayment(params)).toThrow('param validation failed');
        });

        it('should throw error when validation fails - invalid intent code', () => {
            const params = { ...validParams, SifraNamjene: 'XXXX' };
            expect(() => EncodePayment(params)).toThrow('param validation failed');
        });
    });

    describe('Croatian character encoding', () => {
        it('should encode Croatian characters in payer name', () => {
            const params = { ...validParams, ImePlatitelja: 'Marko Šarić' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[3]).toBe('Marko Šarić');
        });

        it('should encode all Croatian special characters', () => {
            const params = { ...validParams, ImePlatitelja: 'ŠĐČĆŽšđčćž' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[3]).toBe('ŠĐČĆŽšđčćž');
        });

        it('should encode Croatian characters in description', () => {
            const params = { ...validParams, OpisPlacanja: 'Plaćanje za uslugu' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[13]).toBe('Plaćanje za uslugu');
        });
    });

    describe('Settings handling', () => {
        it('should use default settings when not provided', () => {
            const result = EncodePayment(validParams);
            expect(result).toBeDefined();
        });

        it('should accept ValidateIBAN setting', () => {
            const result = EncodePayment(validParams, { ValidateIBAN: false });
            expect(result).toBeDefined();
        });

        it('should skip IBAN validation when ValidateIBAN is false', () => {
            // This IBAN has wrong structure but allowed characters
            const params = { ...validParams, IBAN: 'HR12100100518630001' };
            const result = EncodePayment(params, { ValidateIBAN: false });
            expect(result).toBeDefined();
        });

        it('should accept ValidateCalloutNumber setting', () => {
            const result = EncodePayment(validParams, { ValidateCalloutNumber: false });
            expect(result).toBeDefined();
        });

        it('should accept both settings', () => {
            const result = EncodePayment(validParams, {
                ValidateIBAN: true,
                ValidateCalloutNumber: false
            });
            expect(result).toBeDefined();
        });
    });

    describe('Edge cases', () => {
        it('should encode with minimal valid data', () => {
            const minimalParams: PaymentParams = {
                Iznos: '0,01',
                ImePlatitelja: 'A',
                AdresaPlatitelja: 'B',
                SjedistePlatitelja: 'C',
                Primatelj: 'D',
                AdresaPrimatelja: 'E',
                SjedistePrimatelja: 'F',
                IBAN: 'HR1210010051863000160',
                ModelPlacanja: 'HR00',
                PozivNaBroj: '',
                SifraNamjene: '',
                OpisPlacanja: 'G'
            };
            const result = EncodePayment(minimalParams);
            expect(result).toBeDefined();
        });

        it('should encode with maximum length fields', () => {
            const maxParams: PaymentParams = {
                Iznos: '9999999999,99',
                ImePlatitelja: 'A'.repeat(30),
                AdresaPlatitelja: 'B'.repeat(27),
                SjedistePlatitelja: 'C'.repeat(27),
                Primatelj: 'D'.repeat(25),
                AdresaPrimatelja: 'E'.repeat(25),
                SjedistePrimatelja: 'F'.repeat(27),
                IBAN: 'HR1210010051863000160',
                ModelPlacanja: 'HR99',
                PozivNaBroj: '1'.repeat(22),
                SifraNamjene: 'SALA',
                OpisPlacanja: 'G'.repeat(35)
            };
            const result = EncodePayment(maxParams);
            expect(result).toBeDefined();
        });

        it('should encode with allowed punctuation', () => {
            const params = {
                ...validParams,
                ImePlatitelja: "John O'Brien",
                OpisPlacanja: "Payment: 1.000,00 + fee"
            };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[3]).toBe("John O'Brien");
            expect(lines[13]).toBe("Payment: 1.000,00 + fee");
        });

        it('should handle zero amount', () => {
            const params = { ...validParams, Iznos: '0,00' };
            const result = EncodePayment(params);
            const lines = result.split('\n');
            expect(lines[2]).toBe('000000000000000');
        });
    });

    describe('Delimiter handling', () => {
        it('should use line feed (0x0A) as delimiter', () => {
            const result = EncodePayment(validParams);
            expect(result.includes('\n')).toBe(true);
            expect(result.split('\n').length).toBe(15); // 14 fields + trailing delimiter
        });

        it('should end with delimiter', () => {
            const result = EncodePayment(validParams);
            expect(result.endsWith('\n')).toBe(true);
        });

        it('should not contain any other line separators', () => {
            const result = EncodePayment(validParams);
            expect(result.includes('\r')).toBe(false);
        });
    });

    describe('Real-world scenarios', () => {
        it('should encode typical salary payment', () => {
            const salaryParams: PaymentParams = {
                Iznos: '5000,00',
                ImePlatitelja: 'Naziv tvrtke d.o.o.',
                AdresaPlatitelja: 'Savska cesta 100',
                SjedistePlatitelja: 'Zagreb',
                Primatelj: 'Ivan Horvat',
                AdresaPrimatelja: 'Ilica 1',
                SjedistePrimatelja: 'Zagreb',
                IBAN: 'HR1210010051863000160',
                ModelPlacanja: 'HR68',
                PozivNaBroj: '123456789',
                SifraNamjene: 'SALA',
                OpisPlacanja: 'Placa za 11/2024'
            };
            const result = EncodePayment(salaryParams);
            expect(result).toBeDefined();
            const lines = result.split('\n');
            expect(lines[12]).toBe('SALA');
        });

        it('should encode typical utility bill payment', () => {
            const utilityParams: PaymentParams = {
                Iznos: '150,75',
                ImePlatitelja: 'Marko Horvat',
                AdresaPlatitelja: 'Vukovarska 25',
                SjedistePlatitelja: 'Zagreb',
                Primatelj: 'HEP d.d.',
                AdresaPrimatelja: 'Ulica grada Vukovara 37',
                SjedistePrimatelja: 'Zagreb',
                IBAN: 'HR1210010051863000160',
                ModelPlacanja: 'HR64',
                PozivNaBroj: '1234-5678-90',
                SifraNamjene: 'ELEC',
                OpisPlacanja: 'Racun za struju 11/2024'
            };
            const result = EncodePayment(utilityParams);
            expect(result).toBeDefined();
            const lines = result.split('\n');
            expect(lines[12]).toBe('ELEC');
        });

        it('should encode payment with Croatian company names', () => {
            const croatianParams: PaymentParams = {
                Iznos: '1250,50',
                ImePlatitelja: 'Društvo Šarić d.o.o.',
                AdresaPlatitelja: 'Đure Đakovića 5',
                SjedistePlatitelja: 'Čakovec',
                Primatelj: 'Žiro račun Ćosić',
                AdresaPrimatelja: 'Čehovljeva 2',
                SjedistePrimatelja: 'Šibenik',
                IBAN: 'HR1210010051863000160',
                ModelPlacanja: 'HR00',
                PozivNaBroj: '999-888-777',
                SifraNamjene: 'GDSV',
                OpisPlacanja: 'Plaćanje robe i usluga'
            };
            const result = EncodePayment(croatianParams);
            expect(result).toBeDefined();
            const lines = result.split('\n');
            expect(lines[3]).toContain('Š');
            expect(lines[6]).toContain('Ć');
        });
    });
});
