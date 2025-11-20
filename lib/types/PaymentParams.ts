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

function IsPaymentParams(p:PaymentParams): p is PaymentParams {
    if (p === null || p === undefined || typeof p !== 'object') {
        return false;
    }

    return typeof (p as PaymentParams).Iznos !== 'undefined' && (p as PaymentParams).Iznos !== null &&
           typeof (p as PaymentParams).ImePlatitelja !== 'undefined' && (p as PaymentParams).ImePlatitelja !== null &&
           typeof (p as PaymentParams).AdresaPlatitelja !== 'undefined' && (p as PaymentParams).AdresaPlatitelja !== null &&
           typeof (p as PaymentParams).SjedistePlatitelja !== 'undefined' && (p as PaymentParams).SjedistePlatitelja !== null &&
           typeof (p as PaymentParams).Primatelj !== 'undefined' && (p as PaymentParams).Primatelj !== null &&
           typeof (p as PaymentParams).AdresaPrimatelja !== 'undefined' && (p as PaymentParams).AdresaPrimatelja !== null &&
           typeof (p as PaymentParams).SjedistePrimatelja !== 'undefined' && (p as PaymentParams).SjedistePrimatelja !== null &&
           typeof (p as PaymentParams).IBAN !== 'undefined' && (p as PaymentParams).IBAN !== null &&
           typeof (p as PaymentParams).ModelPlacanja !== 'undefined' && (p as PaymentParams).ModelPlacanja !== null &&
           typeof (p as PaymentParams).PozivNaBroj !== 'undefined' && (p as PaymentParams).PozivNaBroj !== null &&
           typeof (p as PaymentParams).SifraNamjene !== 'undefined' && (p as PaymentParams).SifraNamjene !== null &&
           typeof (p as PaymentParams).OpisPlacanja !== 'undefined' && (p as PaymentParams).OpisPlacanja !== null;
};

export { IsPaymentParams };