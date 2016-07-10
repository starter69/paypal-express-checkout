/* @flow */
import request from 'request';
import QS from 'querystring';
import debugLib from 'debug';

const debug = debugLib('paypal-express-checkout');

// flow type for paypal express checkout
export type PaypalECConfigType = {
  isSandbox: bool,
  CURRENCYCODE: string,
  USER: string,
  PWD: string,
  SIGNATURE: string,
  returnUrl: string,
  cancelUrl: string,
  VERSION: string
};

export type PaypalECMethodType = 'SetExpressCheckout' |
  'GetExpressCheckoutDetails' |
  'DoExpressCheckoutPayment';

export type PaypalECRequestParamType = {
  USER: string,
  PWD: string,
  SIGNATURE: string,
  METHOD: string,
  VERSION: string
};

export type PaypalECResultType = {
  errorCode: ?string,
  statusCode: number,
  responseBody: string,
  result: ?Object
};

// default config
const defaultConfig: PaypalECConfigType = {
  isSandbox: true,
  CURRENCYCODE: 'USD',
  USER: '',
  PWD: '',
  SIGNATURE: '',
  returnUrl: '',
  cancelUrl: '',
  VERSION: '86'
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
    debug('%s mode set', this.config.isSandbox ? 'Sandbox' : 'Production');
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
      USER: this.config.USER,
      PWD: this.config.PWD,
      VERSION: this.config.VERSION,
      SIGNATURE: this.config.SIGNATURE,
      returnUrl: this.config.returnUrl,
      cancelUrl: this.config.cancelUrl,
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
      debug(`POST ${uri}`);
      debug(`Form ${JSON.stringify(form, null, 2)}`);

      request.post({
        uri,
        form
      }, (err: ?RequestErrorType, httpResp: RequestHttpResponseType, responseBody: string) => {
        const result: PaypalECResultType = {
          errorCode: null,
          responseBody,
          statusCode: httpResp.statusCode,
          result: QS.parse(responseBody)
        };

        debug(`Response http status ${result.statusCode}`);
        debug(`Response error code ${result.errorCode}`);
        debug(`Response result ${JSON.stringify(result.result, null, 2)}`);

        if (err) {
          result.errorCode = err.code;
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @method getUrlFromToken
   * @param {string} token - auth token created from other funcs
   * @returns {string} Full paypal url to redirect user for actions
   */
  getUrlFromToken(token: string): string {
    const sandboxText: string = this.config.sandbox ? '.sandbox' : '';
    return `https://www${sandboxText}.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${token}`;
  }
}
