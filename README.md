# hub-3a-payment-encoder

Ovaj enkoder opći platni nalog pretvara u tekstualni format pogodan za generiranje 2D bar koda.

**NAPOMENA:** ovaj lib **ne generira** bitmapu 2D bar koda, već samo tekst koji se u taj barcode zapisuje. Za generiranje 2D bitmape možete upotrijebiti neki drugi library kao što je [PDF417-js](https://www.npmjs.com/package/pdf417) 

Ovaj library izveden iz originalne biblioteke [https://github.com/Bikonja/generator-barkoda-uplatnica](https://github.com/Bikonja/generator-barkoda-uplatnica)

## Status projekta

✅ **Kompletno testiran** - 146 unit testova s 96.57% pokrivenošću koda
⚠️ **U razvoju** - još nije dostupan na NPM
⚠️ **Nedostaje** - build setup (TypeScript kompajliranje)

## Legacy implementacija

U direktoriju `docs/BarcodePayment.js` nalazi se originalna JavaScript implementacija koja je korištena kao referenca za TypeScript verziju. Legacy verzija podržava:
- jQuery dependency za array operacije
- Singleton pattern s globalnim `window.BarcodePayment` objektom
- Ručnu validaciju bez IBAN biblioteke
- Podršku za HRK valutu (stara implementacija)

**Napomena:** Nova TypeScript implementacija koristi:
- Moderan ES6+ TypeScript kod
- `ibantools` biblioteku za IBAN validaciju
- EUR valutu (prema važećem standardu)
- Funkcijski pristup umjesto singleton patterna
- Poboljšanu akumulaciju grešaka (bitwise OR)

# How to install
```bash
npm i hub-3a-payment-encoder
```

# API
## Functions
`string` ***EncodePayment***(*paymentParams*:`PaymentParams`, *settings*?:`Partial<BarcodePaymentSettings>`)

Encodes playment parameters into HUB 3A compatible text format used in 2D bar codes

**Params:**
* *paymentParams*:`PaymentParams` = platni nalog
* *settings*:`Partial<BarcodePaymentSettings>` = (opcionalno) validacijske postavke

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

**Važne napomene:**
- `Iznos` - mora biti formatiran s **zarezom** kao decimalnim separatorom (npr. "123,45", ne "123.45")
- `ModelPlacanja` - mora sadržavati **"HR" prefix** (npr. "HR00", "HR01", "HR99")
- Sva polja su stringovi, uključujući `Iznos`
- Za hrvatsku abecedu (Š, Đ, Č, Ć, Ž) svaki znak broji se kao 2 bajta

# Examples
```typescript
import { EncodePayment, ValidatePaymentParams, ValidationResult } from 'hub-3a-payment-encoder';

const paymentParams = {
    Iznos:"123,55",  // NAPOMENA: koristite zarez, ne točku!
    ImePlatitelja:"Ivan Horvat",
    AdresaPlatitelja:"Ilica 23",
    SjedistePlatitelja:"10000 Zagreb",
    Primatelj:"VODOOPSKRBA I ODVODNJA D.O.O.",
    AdresaPrimatelja:"FOLNEGOVIĆEVA 1",
    SjedistePrimatelja:"ZAGREB",
    IBAN:"HR8924020061100679445",
    ModelPlacanja: "HR01",  // MORA sadržavati "HR" prefix!
    PozivNaBroj:"1231213-33452457-12386",
    SifraNamjene:"WTER",
    OpisPlacanja:"RAČUN BROJ 12362444",
};

// Opcija 1: Eksplicitna validacija prije enkodiranja
const validation_result = ValidatePaymentParams(paymentParams, {
    ValidateIBAN: true,
    ValidateCalloutNumber: false
});

if(validation_result !== ValidationResult.OK) {
    console.log(`Payment params are invalid - validation result = ${validation_result}`);

    // Možete provjeriti specifične greške koristeći bitwise operatore
    if(validation_result & ValidationResult.IBANInvalid) {
        console.log("IBAN is invalid");
    }
    if(validation_result & ValidationResult.PricePatternInvalid) {
        console.log("Price format is invalid");
    }
} else {
    const hub3a_text = EncodePayment(paymentParams);
    // ... generirani `hub3a_text` dalje prosljeđujemo library-u za generiranje 2D bar koda
}

// Opcija 2: Direktno enkodiranje (s automatskom validacijom)
try {
    const hub3a_text = EncodePayment(paymentParams, {
        ValidateIBAN: true,
        ValidateCalloutNumber: false
    });

    // ... generirani `hub3a_text` dalje prosljeđujemo library-u za generiranje 2D bar koda

} catch(ex: any) {
    // EncodePayment radi validaciju sadržaja naloga
    // -> ako validacija kaže da nešto nije u redu biti će bačena greška
    console.log("Nalog nije prošao validaciju:", ex.message);
}

```
# Testing

Projekt koristi Jest za unit testiranje.

## Pokretanje testova

```bash
# Pokreni sve testove
npm test

# Pokreni testove u watch modu (automatski re-run pri promjenama)
npm run test:watch

# Pokreni testove s izvještajem o pokrivenosti koda
npm run test:coverage
```

## Test pokrivenost

Trenutna pokrivenost: **96.57%**

Test suite uključuje:
- **validation.test.ts** - 94 testa za sve validacijske funkcije
- **encoding.test.ts** - 36 testova za HUB-3A enkodiranje
- **stringHelpers.test.ts** - 16 testova za helper funkcije

Svi testovi su napisani temeljem ponašanja legacy `BarcodePayment.js` implementacije.
