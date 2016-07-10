// @flow
import PaypalExpressCheckout from './index';
import type { PaypalECResultType } from './index';

/**
 * @class PaypalExpressCheckout/ParallelPayment
 */
export default class extends PaypalExpressCheckout {
  /**
   * @method getExpressCheckoutDetails
   * @param {string} token - auth token
   * @returns {Promise<PaypalECResultType>} promise of api call result
   */
  getExpressCheckoutDetails(token: string): Promise<PaypalECResultType> {
    const params: Object = {
      TOKEN: token
    };
    return this.call('GetExpressCheckoutDetails', params);
  }
}
