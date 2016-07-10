// @flow
import PaypalExpressCheckout from './index';
import type { PaypalECResultType } from './index';

/**
 * @class PaypalExpressCheckout/ReferencePayment
 */
export default class extends PaypalExpressCheckout {
  /**
   * @method getBillingAuthorizationToken
   * @param {string} billingType - type of billing agreement
   * @param {string} billingDesription - billing agreement description
   * @returns {Promise<PaypalECResultType>} promise of api call result
   */
  getAuthorizationToken(billingType: string, billingDesription: string): Promise<PaypalECResultType> {
    const params: Object = {
      PAYMENTREQUEST_0_PAYMENTACTION: 'AUTHORIZATION',
      PAYMENTREQUEST_0_AMT: 0,
      PAYMENTREQUEST_0_CURRENCYCODE: this.config.CURRENCYCODE,
      L_BILLINGTYPE0: billingType,
      L_BILLINGAGREEMENTDESCRIPTION0: billingDesription,
      VERSION: '86'
    };

    return this.call('SetExpressCheckout', params);
  }

  /**
   * @method createBillingAgreement
   * @param {string} token - auth token created from getBillingAuthorizationToken
   * @returns {Promise<PaypalECResultType>} promise of api call result
   */
  createBillingAgreement(token: string): Promise<PaypalECResultType> {
    const params: Object = {
      TOKEN: token
    };
    return this.call('CreateBillingAgreement', params);
  }

  /**
   * @method doReferenceTransaction
   * @param {string} amount - money to capture from customer's account
   * @param {string} paymentAction - type of payment
   * @param {referenceID} - billing id created with createBillingAgreement
   * @returns {Promise<PaypalECResultType>} promise of api call result
   */
  doReferenceTransaction(amount: number, paymentAction: string, referenceID: string): Promise<PaypalECResultType> {
    const params: Object = {
      AMT: amount,
      PAYMENTACTION: paymentAction,
      REFERENCEID: referenceID
    };
    return this.call('DoReferenceTransaction', params);
  }
}
