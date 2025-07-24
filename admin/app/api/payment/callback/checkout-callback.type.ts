export type CheckoutCallback = {
  store_id: string;
  amount: number;
  invoice_id: string;
  billing_id: string;
  payment_time: string;
  phone: string;
  card_pan: string;
  card_token: string;
  uuid: string;
  receipt_url: string;
  sign: string;
};
