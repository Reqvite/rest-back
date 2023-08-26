const axios = require('axios');
const crypto = require('crypto');
const { BadRequestError } = require('../../../utils/errors/CustomErrors');

class LiqPay {
  constructor(public_key, private_key) {
    this.host = 'https://www.liqpay.ua/api/';
    this.public_key = public_key;
    this.private_key = private_key;
  }

  api(path, params, callback, callbackerr) {
    if (!params.version) {
      throw new BadRequestError('The version is not specified');
    }

    params.public_key = this.public_key;
    const data = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature = this.strToSign(this.private_key + data + this.private_key);

    axios
      .post(
        this.host + path,
        { data: data, signature: signature },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        callback(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        callbackerr(error, error.response);
      });
  }

  cnbParams(params) {
    params.public_key = this.public_key;

    if (!params.version) {
      throw new BadRequestError('The version is not specified');
    }
    if (!params.amount) {
      throw new BadRequestError('The amount is not specified');
    }
    if (!params.currency) {
      throw new BadRequestError('The currency is not specified');
    }
    if (!params.description) {
      throw new BadRequestError('The description is not specified');
    }

    return params;
  }

  strToSign(str) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('base64');
  }

  cnbObject(params) {
    let language = 'ua';

    if (params.language) {
      language = params.language;
    }

    params = this.cnbParams(params);
    const data = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature = this.strToSign(this.private_key + data + this.private_key);

    return { data, signature };
  }

  decodeBase64UTF8(base64String) {
    try {
      const decodedBase64 = Buffer.from(base64String, 'base64');
      const decodedUTF8 = new TextDecoder().decode(decodedBase64);
      const parsedData = JSON.parse(decodedUTF8);
      return parsedData;
    } catch {
      throw new BadRequestError('Invalid base64 data');
    }
  }
}

module.exports = LiqPay;
