# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library for encoding Croatian HUB-3A payment slip data into text format suitable for 2D barcode generation (PDF417). The library validates and encodes payment parameters according to the HUB-3A standard used by Croatian banks.

**Important:** This library only generates the encoded text string for barcodes—it does NOT generate the actual 2D barcode bitmap. Users need a separate library like PDF417-js for bitmap generation.

**Project Status:** The library is functional but incomplete. Missing components:
- TypeScript build configuration (tsconfig.json)
- Build tooling (webpack/rollup)
- Unit tests (Jest)

## Architecture

### Core Flow
1. **Validation** → 2. **Encoding** → 3. **Output Text String**

The library follows a two-stage validation approach:
1. Pre-validation via `ValidatePaymentParams()` (optional, returns `ValidationResult` enum)
2. Internal validation in `EncodePayment()` (throws errors on failure)

### Module Structure

```
lib/
├── index.ts                          # Public API exports
├── types/
│   ├── PaymentParams.ts              # Payment data interface + type guard
│   └── BarcodePaymentSettings.ts     # Validation settings
└── helpers/
    ├── EncodePayment.ts              # Main encoding function
    ├── validation.ts                 # Validation functions
    ├── constants.ts                  # HUB-3A constants, max lengths, ValidationResult enum
    ├── IntentCodes.ts                # SEPA intent codes (171 entries from PBZ)
    ├── PaymentModels.ts              # Croatian payment models (HR00-HR99)
    └── stringHelpers.ts              # UTF-8 length calculation, price formatting
```

### Key Components

**PaymentParams Interface** (lib/types/PaymentParams.ts)
- Contains 12 required fields for payment information
- All fields are strings (including `Iznos`/amount)
- Has type guard `IsPaymentParams()` for runtime validation

**ValidationResult Enum** (lib/helpers/constants.ts)
- Bitwise flags for granular validation errors
- Each field has two possible errors: Invalid (pattern/content) and MaxLengthExceeded
- Can be combined: `result |= ValidationResult.IBANInvalid`

**Encoding Constants** (lib/helpers/constants.ts)
- `_header`: "HRVHUB30"
- `_currency`: "EUR"
- `_delimiter`: Line feed character (0x0A)
- `_paymentModelPrefix`: "HR" (for reference only - not used in encoding, users provide full model code)
- Character whitelist for single-byte and two-byte Croatian characters (Š, Đ, Č, Ć, Ž)

**String Length Calculation** (lib/helpers/stringHelpers.ts)
- Custom `GetLength()` function calculates byte length, not character count
- Croatian special characters (Š, Đ, Č, Ć, Ž) count as 2 bytes
- Returns -1 if string contains disallowed characters
- This is crucial for HUB-3A field length validation

**Validation Settings** (lib/types/BarcodePaymentSettings.ts)
- `ValidateIBAN`: boolean (default: true) - Uses ibantools library
- `ValidateCalloutNumber`: boolean (default: false) - NOT IMPLEMENTED

### Reference Data

**Payment Models** (lib/helpers/PaymentModels.ts)
- Simple array of valid Croatian payment model codes (HR00-HR99)
- **Important:** Models include the "HR" prefix (e.g., "HR00", "HR01") - users must provide the full code including prefix
- Source: FINA website
- TODO: Add validation rules specific to each model

**Intent Codes** (lib/helpers/IntentCodes.ts)
- 171 SEPA purpose codes (e.g., "SALA" for salary, "WTER" for water bill)
- Source: PBZ (Privredna Banka Zagreb) net banking
- Each entry has `code` and Croatian `title`

## Dependencies

- **ibantools** (^4.1.3): IBAN validation library

## Development Notes

### Working with Validation

The `ValidationResult` enum uses bitwise flags, so:
- Check for specific errors: `if (result & ValidationResult.IBANInvalid)`
- Check if valid: `if (result === ValidationResult.OK)`
- Multiple errors can coexist in a single result value

### Price Encoding

Prices must be formatted as "123,55" (comma decimal separator) in input, but are encoded without the comma and zero-padded to 15 characters: "000000012355".

### Payment Model Format

Payment models **must include the "HR" prefix** in the input (e.g., "HR00", "HR01", "HR99"). The library does NOT add this prefix during encoding - it expects users to provide the complete model code. This matches the legacy implementation behavior.

### Character Encoding

The library enforces a strict character whitelist for HUB-3A compatibility:
- Latin alphanumeric characters
- Croatian special characters: Š, Đ, Č, Ć, Ž (and lowercase)
- Limited punctuation: space, comma, period, colon, hyphen, plus, question mark, apostrophe, slash, parentheses

If an input string contains any character outside this whitelist, `GetLength()` returns -1, triggering validation errors.

### Missing Validation

`IsCalloutNumberValid()` always returns `true` - validation by payment model is not implemented. Reference document exists: https://www.fina.hr/documents/52450/238316/Jedinstveni-pregled-osnovnih-modela-poziva-na-broj_4.8.2018.pdf
