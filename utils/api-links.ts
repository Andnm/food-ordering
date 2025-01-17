export const urlServerSide = "http://127.0.0.1:8080";

const apiLinks = {
  user: {
    getInfo: `${urlServerSide}/user/get-user-info`,
    register: `${urlServerSide}/user/register`,
    loginWithUsername: `${urlServerSide}/user/login`,
    forgotPassword: `${urlServerSide}/user/forgot-password`,
    updateInfo: `${urlServerSide}/user/update-user`,
    changePassword: `${urlServerSide}/user/change-password`,
    getAllUsersByAdmin: `${urlServerSide}/user/get-list-user`,
  },
  item: {
    createItem: `${urlServerSide}/item/create-new-item`,
    updateItem: `${urlServerSide}/item/update-item`,
    getListItems: `${urlServerSide}/item/get-list-item`,
    getItemInfo: `${urlServerSide}/item/get-item-info`,
    deleteItem: `${urlServerSide}/item/delete-item`,
  },
  order: {
    getListOrderByAdmin: `${urlServerSide}/order/get-list-order`,
    getListOrderByUser: `${urlServerSide}/order/get-list-order-by-user`,
    getOrderInfo: `${urlServerSide}/order/get-order-info`,
    createNewOrder: `${urlServerSide}/order/create-new-order`,
    updateDeliveryStatus: `${urlServerSide}/order/change-order-to-delivery`,
    updateReceiveStatus: `${urlServerSide}/order/change-order-to-received`,
    updateCancelStatus: `${urlServerSide}/order/change-order-to-cancel`,
  },
  payment: {
    createPaymentLink: `${urlServerSide}/payment/create-payment-link`,
  },
  invoice: {
    getAllInvoices: `${urlServerSide}/invoice/invoices`,
  },
  notification: {
    getAllNotifications: `${urlServerSide}/notification/get-all-notifications`,
    createNotification: `${urlServerSide}/notification/create-notification`,
    markAllAsSeen: `${urlServerSide}/notification/mark-all-as-seen`,
    markSeenOne: `${urlServerSide}/notification/update-notification`,
  },
};

export default apiLinks;
