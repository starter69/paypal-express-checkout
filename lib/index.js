/* @flow */
import request from 'request';
import QS from 'querystring';

// flow type for paypal express checkout
export type PaypalECConfigType = {
  isSandbox: bool,
  currency: string,
  user: string,
  password: string,
  signature: string,
  defaultReturnUrl: string,
  defaultCancelUrl: string,
  version: number
};

export type PaypalECMethodType = 'SetExpressCheckout' |
  'GetExpressCheckoutDetails' |
  'DoExpressCheckoutPayment';

export type PaypalECRequestParamType = {
  USER: string,
  PWD: string,
  SIGNATURE: string,
  METHOD: string,
  VERSION: number
};

export type PaypalECResultType = {
  errorCode: ?string,
  statusCode: number,
  responseBody: string,
  parsedResult: ?Object
};


// default config
const defaultConfig: PaypalECConfigType = {
  isSandbox: true,
  currency: 'USD',
  user: '',
  password: '',
  signature: '',
  defaultReturnUrl: '',
  defaultCancelUrl: '',
  version: 86
};

// flow types for request
type RequestErrorType = {
  code: string
};

type RequestHttpResponseType = {
  statusCode: number
};

/**
 * @class PaypalExpressCheckout
 */
export default class {
  /**
   * @property config
   */
  config: PaypalECConfigType

  /**
   * @method constructor
   * @param { Object } config - initial config
   */
  constructor(config: Object) {
    this.setConfig(Object.assign({}, defaultConfig, config));
  }

  /**
   * @method setConfig
   * @param { Object } config - new config to set
   */
  setConfig(config: Object) {
    this.config = Object.assign({}, this.config, config);
  }

  /**
   * @method _getAPIEndpoint
   * @private
   * @returns {string} paypal API endpoint from config
   */
  _getAPIEndpoint(): string {
    return this.config.isSandbox ? 'https://api-3t.sandbox.paypal.com/nvp' : 'https://api-3t.paypal.com/nvp';
  }

  /**
   * @method _getRequestParams
   * @private
   * @param {PaypalECMethodType} method - api method
   * @param {Object} params - key,value based parameter list for api
   * @returns {PaypalECRequestParamType} parameter object for paypal express checkout call
   */
  _getRequestParams(method: PaypalECMethodType, params: Object): PaypalECRequestParamType {
    return {
      ...params,
      USER: this.config.user,
      PWD: this.config.password,
      VERSION: this.config.version,
      SIGNATURE: this.config.signature,
      METHOD: method
    };
  }

  /**
   * @method call
   * @param {PaypalECMethodType} method - api method
   * @param {Object} params - key,value based parameter list for api
   * @returns {Promise<PaypalECResultType>} promise of api call result
   */
  call(method: PaypalECMethodType, params: Object): Promise<PaypalECResultType> {
    const uri: string = this._getAPIEndpoint();
    const form: PaypalECRequestParamType = this._getRequestParams(method, params);

    return new Promise((resolve: Function, reject: Function) => {
      request.post({
        uri,
        form
      }, (err: ?RequestErrorType, httpResp: RequestHttpResponseType, responseBody: string) => {
        const result: PaypalECResultType = {
          errorCode: null,
          responseBody,
          statusCode: httpResp.statusCode,
          parsedResult: QS.parse(responseBody)
        };

        if (err) {
          result.errorCode = err.code;
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }
}
