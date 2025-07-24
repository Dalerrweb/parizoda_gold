export type ChekoutUrlResponseType = {
  success: number;
  data: {
    store_id: number;
    amount: number;
    invoice_id: string;
    callback_url: string;
    uuid: string;
    products: null;
    ofd: null;
    split: null;
    return_url: null;
    return_error_url: null;
    short_link: string;
    sms: null;
    added_on: string;
    updated_on: string;
    payment: [];
    checkout_url: string;
    deeplink: string;
  };
};
