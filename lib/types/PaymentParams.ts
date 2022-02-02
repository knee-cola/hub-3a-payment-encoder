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
    return typeof (p as PaymentParams).Iznos !== undefined &&
           typeof (p as PaymentParams).ImePlatitelja !== undefined &&
           typeof (p as PaymentParams).AdresaPlatitelja !== undefined &&
           typeof (p as PaymentParams).SjedistePlatitelja !== undefined &&
           typeof (p as PaymentParams).Primatelj !== undefined &&
           typeof (p as PaymentParams).AdresaPrimatelja !== undefined &&
           typeof (p as PaymentParams).SjedistePrimatelja !== undefined &&
           typeof (p as PaymentParams).IBAN !== undefined &&
           typeof (p as PaymentParams).ModelPlacanja !== undefined &&
           typeof (p as PaymentParams).PozivNaBroj !== undefined &&
           typeof (p as PaymentParams).SifraNamjene !== undefined &&
           typeof (p as PaymentParams).OpisPlacanja !== undefined;
};

export { IsPaymentParams };