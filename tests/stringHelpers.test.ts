import { GetLength, PadLeft, StringNotDefinedOrEmpty, EncodePrice, ConcatenateStrings } from '../lib/helpers/stringHelpers';

describe('String Helper Functions', () => {

    describe('GetLength', () => {
        it('should return 0 for empty string', () => {
            expect(GetLength('')).toBe(0);
        });

        it('should return correct length for ASCII characters', () => {
            expect(GetLength('ABC')).toBe(3);
            expect(GetLength('1234567890')).toBe(10);
        });

        it('should return correct length for single-byte characters', () => {
            expect(GetLength('abcdefghijklmnopqrstuvwxyz')).toBe(26);
            expect(GetLength('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(26);
            expect(GetLength('0123456789')).toBe(10);
        });

        it('should count Croatian uppercase characters as 2 bytes', () => {
            expect(GetLength('Š')).toBe(2);
            expect(GetLength('Đ')).toBe(2);
            expect(GetLength('Č')).toBe(2);
            expect(GetLength('Ć')).toBe(2);
            expect(GetLength('Ž')).toBe(2);
        });

        it('should count Croatian lowercase characters as 2 bytes', () => {
            expect(GetLength('š')).toBe(2);
            expect(GetLength('đ')).toBe(2);
            expect(GetLength('č')).toBe(2);
            expect(GetLength('ć')).toBe(2);
            expect(GetLength('ž')).toBe(2);
        });

        it('should count all Croatian characters correctly', () => {
            expect(GetLength('ŠĐČĆŽšđčćž')).toBe(20); // 10 chars * 2 bytes
        });

        it('should handle mixed single and double byte characters', () => {
            expect(GetLength('AŠB')).toBe(4); // 1 + 2 + 1
            expect(GetLength('MarkoŠarić')).toBe(12); // 5 + 2 + 4 + 1 + 2 = 14... wait
            // M=1, a=1, r=1, k=1, o=1, Š=2, a=1, r=1, i=1, ć=2
            expect(GetLength('MarkoŠarić')).toBe(12);
        });

        it('should accept allowed punctuation', () => {
            expect(GetLength(' ')).toBe(1); // space
            expect(GetLength(',')).toBe(1);
            expect(GetLength('.')).toBe(1);
            expect(GetLength(':')).toBe(1);
            expect(GetLength('-')).toBe(1);
            expect(GetLength('+')).toBe(1);
            expect(GetLength('?')).toBe(1);
            expect(GetLength("'")).toBe(1);
            expect(GetLength('/')).toBe(1);
            expect(GetLength('(')).toBe(1);
            expect(GetLength(')')).toBe(1);
        });

        it('should accept string with allowed punctuation', () => {
            expect(GetLength('Test: 1,000.00 + 10%')).toBe(-1); // % is not allowed
            expect(GetLength('Test: 1,000.00')).toBe(14);
            expect(GetLength("O'Brien")).toBe(7);
            expect(GetLength('(test)')).toBe(6);
        });

        it('should return -1 for disallowed characters', () => {
            expect(GetLength('test@example.com')).toBe(-1); // @ not allowed
            expect(GetLength('test#tag')).toBe(-1); // # not allowed
            expect(GetLength('test$100')).toBe(-1); // $ not allowed
            expect(GetLength('50%')).toBe(-1); // % not allowed
            expect(GetLength('A&B')).toBe(-1); // & not allowed
            expect(GetLength('test*')).toBe(-1); // * not allowed
        });

        it('should return -1 for strings with special Unicode characters', () => {
            expect(GetLength('test€')).toBe(-1); // € not allowed
            expect(GetLength('test™')).toBe(-1); // ™ not allowed
            expect(GetLength('test©')).toBe(-1); // © not allowed
        });

        it('should return -1 for emoji', () => {
            expect(GetLength('😀')).toBe(-1);
            expect(GetLength('test 😀')).toBe(-1);
        });

        it('should handle undefined gracefully', () => {
            expect(GetLength(undefined as any)).toBe(0);
        });

        it('should handle null gracefully', () => {
            expect(GetLength(null as any)).toBe(0);
        });
    });

    describe('PadLeft', () => {
        it('should pad string to specified length', () => {
            expect(PadLeft('123', 5, '0')).toBe('00123');
        });

        it('should pad with multiple characters if needed', () => {
            expect(PadLeft('1', 5, '0')).toBe('00001');
        });

        it('should not pad if string is already long enough', () => {
            expect(PadLeft('12345', 3, '0')).toBe('12345');
        });

        it('should handle exact length match', () => {
            expect(PadLeft('123', 3, '0')).toBe('123');
        });

        it('should pad with different characters', () => {
            expect(PadLeft('x', 5, '_')).toBe('____x');
            expect(PadLeft('test', 10, ' ')).toBe('      test');
        });

        it('should handle empty string', () => {
            expect(PadLeft('', 3, '0')).toBe('000');
        });

        it('should pad large numbers', () => {
            expect(PadLeft('999', 15, '0')).toBe('000000000000999');
        });
    });

    describe('StringNotDefinedOrEmpty', () => {
        it('should return true for undefined', () => {
            expect(StringNotDefinedOrEmpty(undefined)).toBe(true);
        });

        it('should return true for null', () => {
            expect(StringNotDefinedOrEmpty(null)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(StringNotDefinedOrEmpty('')).toBe(true);
        });

        it('should return false for non-empty string', () => {
            expect(StringNotDefinedOrEmpty('test')).toBe(false);
            expect(StringNotDefinedOrEmpty('a')).toBe(false);
            expect(StringNotDefinedOrEmpty(' ')).toBe(false);
        });

        it('should return false for string with spaces', () => {
            expect(StringNotDefinedOrEmpty('   ')).toBe(false);
        });

        it('should return false for zero', () => {
            expect(StringNotDefinedOrEmpty('0')).toBe(false);
        });
    });

    describe('EncodePrice', () => {
        it('should encode price with comma correctly', () => {
            expect(EncodePrice('123,45')).toBe('000000000012345');
        });

        it('should remove comma from price', () => {
            expect(EncodePrice('1,00')).toBe('000000000000100');
        });

        it('should pad to 15 characters', () => {
            expect(EncodePrice('0,01').length).toBe(15);
            expect(EncodePrice('9999999999,99').length).toBe(15);
        });

        it('should encode zero correctly', () => {
            expect(EncodePrice('0,00')).toBe('000000000000000');
        });

        it('should encode large amounts correctly', () => {
            expect(EncodePrice('9999999999,99')).toBe('000999999999999');
        });

        it('should encode small amounts correctly', () => {
            expect(EncodePrice('0,01')).toBe('000000000000001');
            expect(EncodePrice('0,99')).toBe('000000000000099');
        });

        it('should encode typical amounts', () => {
            expect(EncodePrice('100,00')).toBe('000000000010000');
            expect(EncodePrice('1234,56')).toBe('000000000123456');
            expect(EncodePrice('50,50')).toBe('000000000005050');
        });

        it('should handle amounts without leading zero', () => {
            expect(EncodePrice('5,00')).toBe('000000000000500');
        });

        it('should handle amounts with many digits', () => {
            expect(EncodePrice('123456,78')).toBe('000000012345678');
        });
    });

    describe('ConcatenateStrings', () => {
        it('should concatenate multiple strings', () => {
            expect(ConcatenateStrings('a', 'b', 'c')).toBe('abc');
        });

        it('should handle empty strings', () => {
            expect(ConcatenateStrings('a', '', 'c')).toBe('ac');
        });

        it('should handle single string', () => {
            expect(ConcatenateStrings('test')).toBe('test');
        });

        it('should handle no arguments', () => {
            expect(ConcatenateStrings()).toBe('');
        });

        it('should skip undefined values', () => {
            expect(ConcatenateStrings('a', undefined, 'c')).toBe('ac');
        });

        it('should concatenate many strings', () => {
            expect(ConcatenateStrings('1', '2', '3', '4', '5')).toBe('12345');
        });

        it('should handle strings with special characters', () => {
            expect(ConcatenateStrings('Hello', ' ', 'World', '!')).toBe('Hello World!');
        });

        it('should handle Croatian characters', () => {
            expect(ConcatenateStrings('Š', 'Đ', 'Č')).toBe('ŠĐČ');
        });

        it('should concatenate with delimiters', () => {
            const delimiter = '\n';
            expect(ConcatenateStrings('A', delimiter, 'B', delimiter, 'C')).toBe('A\nB\nC');
        });

        it('should handle real payment encoding scenario', () => {
            const delimiter = '\n';
            const result = ConcatenateStrings(
                'HRVHUB30', delimiter,
                'EUR', delimiter,
                '000000000012345', delimiter,
                'Test'
            );
            expect(result).toBe('HRVHUB30\nEUR\n000000000012345\nTest');
        });
    });

    describe('Integration scenarios', () => {
        it('should properly calculate length of typical payment fields', () => {
            expect(GetLength('Ivan Horvat')).toBeLessThanOrEqual(30); // Max payer name
            expect(GetLength('Test d.o.o.')).toBeLessThanOrEqual(25); // Max receiver name
            expect(GetLength('HR1210010051863000160')).toBeLessThanOrEqual(21); // Max IBAN
        });

        it('should handle typical Croatian names', () => {
            expect(GetLength('Marko Šarić')).toBe(13); // M(1)a(1)r(1)k(1)o(1) (1)Š(2)a(1)r(1)i(1)ć(2) = 13
            expect(GetLength('Pero Perić')).toBe(11); // P(1)e(1)r(1)o(1) (1)P(1)e(1)r(1)i(1)ć(2) = 11
            expect(GetLength('Ana Kovačić')).toBe(13); // A(1)n(1)a(1) (1)K(1)o(1)v(1)a(1)č(2)i(1)ć(2) = 13
        });

        it('should verify price encoding for common amounts', () => {
            const amounts = [
                { input: '100,00', expected: '000000000010000' },
                { input: '50,50', expected: '000000000005050' },
                { input: '1234,99', expected: '000000000123499' },
                { input: '0,01', expected: '000000000000001' }
            ];

            amounts.forEach(({ input, expected }) => {
                expect(EncodePrice(input)).toBe(expected);
            });
        });

        it('should pad various string lengths correctly', () => {
            expect(PadLeft('1', 15, '0')).toBe('000000000000001');
            expect(PadLeft('12', 15, '0')).toBe('000000000000012');
            expect(PadLeft('123', 15, '0')).toBe('000000000000123');
            expect(PadLeft('12345', 15, '0')).toBe('000000000012345');
        });

        it('should correctly identify valid and invalid field values', () => {
            // Valid values
            expect(StringNotDefinedOrEmpty('Valid text')).toBe(false);
            expect(StringNotDefinedOrEmpty('0')).toBe(false);

            // Invalid values
            expect(StringNotDefinedOrEmpty('')).toBe(true);
            expect(StringNotDefinedOrEmpty(undefined)).toBe(true);
            expect(StringNotDefinedOrEmpty(null)).toBe(true);
        });
    });
});
