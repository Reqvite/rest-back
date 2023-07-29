const LiqPay = require("./lib/liqpay");
const { PUBLIC_LIQPAY_KEY, PRIVATE_LIQPAY_KEY, BASE_URL, BASE_URL_FRONT } =
  process.env;
const liqpay = new LiqPay(PUBLIC_LIQPAY_KEY, PRIVATE_LIQPAY_KEY);

const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/transactions/status"
    : `${BASE_URL}/orders/status`;

const frontUrl =
  process.env.NODE_ENV === "development"
    ? "https://www.youtube.com/"
    : `${BASE_URL_FRONT}`;

const LiqPayService = {
  getLiqPayPaymentData: (amount, order_id) => {
    const description = `Payment for the restaurant bill according to order №${order_id}`;

    const dataParams = {
      public_key: PUBLIC_LIQPAY_KEY,
      version: 3,
      action: "pay",
      amount,
      currency: "USD",
      description,
      order_id,
      result_url: frontUrl,
      server_url: apiUrl,
    };

    return liqpay.cnbObject(dataParams);
  },

  getPaymentStatus: (data, signature) => {
    const str = PRIVATE_LIQPAY_KEY + data + PRIVATE_LIQPAY_KEY;
    const mySign = liqpay.strToSign(str);

    if (mySign !== signature) {
      // need to change to api errors
      throw new Error("Invalid signature");
    }

    const { order_id, status, info } = liqpay.decodeBase64UTF8(data);

    return {
      order_id,
      status,
      info,
    };
  },
};

module.exports = LiqPayService;
