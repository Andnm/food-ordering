import { PaymentState } from "@models/payment";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createPaymentLink = async (
  token: string,
  model: PaymentState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.payment.createPaymentLink}`,
    token: token,
    data: model,
  });
  return response.data;
};

const payment = { createPaymentLink };

export default payment;
