import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getAllInvoices = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.invoice.getAllInvoices}`,
    token: token,
  });
  return response.data;
};

const invoice = { getAllInvoices };

export default invoice;
