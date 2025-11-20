# hub-3a-payment-encoder

This encoder converts Croatian HUB-3A payment slips into text format suitable for 2D barcode generation.

**NOTE:** This library does **not generate** the 2D barcode bitmap, only the text that is encoded in the barcode. To generate the actual 2D bitmap, you can use another library such as [PDF417-js](https://www.npmjs.com/package/pdf417)

This library is derived from the original library [https://github.com/Bikonja/generator-barkoda-uplatnica](https://github.com/Bikonja/generator-barkoda-uplatnica)

## Legacy Implementation

The original JavaScript implementation used as a reference for the TypeScript version can be found in the `docs/BarcodePayment.js` directory. The legacy version supports:
- jQuery dependency for array operations
- Singleton pattern with global `window.BarcodePayment` object
- Manual validation without IBAN library
- HRK currency support (old implementation)

**Note:** The new TypeScript implementation uses:
- Modern ES6+ TypeScript code
- `ibantools` library for IBAN validation
- EUR currency (according to current standard)
- Functional approach instead of singleton pattern
- Improved error accumulation (bitwise OR)

# How to install
```bash
npm i hub-3a-payment-encoder
```

# API
## Functions
`string` ***EncodePayment***(*paymentParams*:`PaymentParams`, *settings*?:`Partial<BarcodePaymentSettings>`)

Encodes playment parameters into HUB 3A compatible text format used in 2D bar codes

**Params:**
* *paymentParams*:`PaymentParams` = payment slip data
* *settings*:`Partial<BarcodePaymentSettings>` = (optional) validation settings

**Returns:** HUB 3A 2D barcode string

## Data structures
```typescript
export interface PaymentParams {
    Iznos:string
    ImePlatitelja:string
    AdresaPlatitelja:string
    SjedistePlatitelja:string
    Primatelj:string
    AdresaPrimatelja:string
    SjedistePrimatelja:string
    IBAN:string
    ModelPlacanja:string
    PozivNaBroj:string
    SifraNamjene:string
    OpisPlacanja:string
}
```

**Important notes:**
- `Iznos` - must be formatted with a **comma** as the decimal separator (e.g., "123,45", not "123.45")
- `ModelPlacanja` - must contain the **"HR" prefix** (e.g., "HR00", "HR01", "HR99")
- All fields are strings, including `Iznos`
- For Croatian alphabet characters (Š, Đ, Č, Ć, Ž), each character counts as 2 bytes

## Validation Functions

The library exports several validation functions:
- `IsIBANValid(iban: string): boolean` - Validates IBAN format using the ibantools library
- `IsPaymentModelValid(paymentModel: string): boolean` - Validates payment model codes (HR00-HR99)
- `IsIntentCodeValid(intentCode: string): boolean` - Validates SEPA purpose codes
- `IsCalloutNumberValid(calloutNumber: string, paymentModel: string): boolean` - **⚠️ NOT IMPLEMENTED** - Always returns `true`. Proper validation by payment model is not yet available.
- `ValidatePaymentParams(paymentParams: PaymentParams, settings?: BarcodePaymentSettings): ValidationResult` - Validates all payment parameters

**Note:** The `ValidateCalloutNumber` setting in `BarcodePaymentSettings` is available but has no effect since `IsCalloutNumberValid` is not implemented.

# Examples
```typescript
import { EncodePayment, ValidatePaymentParams, ValidationResult } from 'hub-3a-payment-encoder';

const paymentParams = {
    Iznos:"123,55",  // NOTE: use comma, not period!
    ImePlatitelja:"Ivan Horvat",
    AdresaPlatitelja:"Ilica 23",
    SjedistePlatitelja:"10000 Zagreb",
    Primatelj:"VODOOPSKRBA I ODVODNJA D.O.O.",
    AdresaPrimatelja:"FOLNEGOVIĆEVA 1",
    SjedistePrimatelja:"ZAGREB",
    IBAN:"HR8924020061100679445",
    ModelPlacanja: "HR01",  // MUST contain "HR" prefix!
    PozivNaBroj:"1231213-33452457-12386",
    SifraNamjene:"WTER",
    OpisPlacanja:"RAČUN BROJ 12362444",
};

// Option 1: Explicit validation before encoding
const validation_result = ValidatePaymentParams(paymentParams, {
    ValidateIBAN: true,
    ValidateCalloutNumber: false
});

if(validation_result !== ValidationResult.OK) {
    console.log(`Payment params are invalid - validation result = ${validation_result}`);

    // You can check for specific errors using bitwise operators
    if(validation_result & ValidationResult.IBANInvalid) {
        console.log("IBAN is invalid");
    }
    if(validation_result & ValidationResult.PricePatternInvalid) {
        console.log("Price format is invalid");
    }
} else {
    const hub3a_text = EncodePayment(paymentParams);
    // ... pass the generated `hub3a_text` to a 2D barcode generation library
}

// Option 2: Direct encoding (with automatic validation)
try {
    const hub3a_text = EncodePayment(paymentParams, {
        ValidateIBAN: true,
        ValidateCalloutNumber: false
    });

    // ... pass the generated `hub3a_text` to a 2D barcode generation library

} catch(ex: any) {
    // EncodePayment validates the payment slip data
    // -> if validation fails, an error will be thrown
    console.log("Payment slip failed validation:", ex.message);
}

```
# Testing

The project uses Jest for unit testing.

## Running tests

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically re-run on changes)
npm run test:watch

# Run tests with code coverage report
npm run test:coverage
```

## Test coverage

Current coverage: **96.57%**

The test suite includes:
- **validation.test.ts** - 94 tests for all validation functions
- **encoding.test.ts** - 36 tests for HUB-3A encoding
- **stringHelpers.test.ts** - 16 tests for helper functions

All tests are written based on the behavior of the legacy `BarcodePayment.js` implementation.
