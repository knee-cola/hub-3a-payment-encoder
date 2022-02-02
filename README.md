# NEDOVRŠENO
**NAPOMENA:** ovaj library još nije dovršen, niti je dostupan na NPM

Nedostaje slijedeće:
* build setup (typescript / webpack)
* unit tests (jest)

# hub-3a-payment-encoder

Ovaj enkoder opći platni nalog pretvara u tekstualni format pogodan za generiranje 2D bar koda.

**NAPOMENA:** ovaj lib **ne generira** bitmapu 2D bar koda, već samo tekst koji se u taj barcode zapisuje. Za generiranje 2D bitmape možete upotrijebiti neki drugi library kao što je [PDF417-js](https://www.npmjs.com/package/pdf417) 

Ovaj library izveden iz originalne biblioteke [https://github.com/Bikonja/generator-barkoda-uplatnica](https://github.com/Bikonja/generator-barkoda-uplatnica)

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
# Examples
```typescript
import { EncodePayment, ValidatePaymentParams, ValidationResult } from 'hub-3a-payment-encoder';

const paymentParams = {
    Iznos:"123.55",
    ImePlatitelja:"Ivan Horvat",
    AdresaPlatitelja:"Ilica 23",
    SjedistePlatitelja:"10000 Zagreb",
    Primatelj:"VODOOPSKRBA I ODVODNJA D.O.O.",
    AdresaPrimatelja:"FOLNEGOVIĆEVA 1",
    SjedistePrimatelja:"ZAGREB",
    IBAN:"HR8924020061100679445",
    ModelPlacanja: "HR01",
    PozivNaBroj:"1231213-33452457-12386",
    SifraNamjene:"WTER",
    OpisPlacanja:"RAČUN BROJ 12362444",
};

const validation_result = ValidatePaymentParams(paymentParams);

if(validation_result !== ValidationResult.OK) {
    console.log(`payment params are invalid - validation result = ${validation_result}`)
} else {
    try {
    const hub3a_text = EncodePayment(paymentParams);

    // ... generirani `hub3a_text` dalje prosljeđujemo libratiy-u za generiranje 2D bar koda

    } catch(ex:any) 
        // encoder radi validaciju sadržaja naloga
        // -> ako validacija kaže da nešto nije u redu biti će bačena greška
        console.log("nalog nije prošao validaciju");
    }
}

```