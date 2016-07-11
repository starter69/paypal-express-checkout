'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// default config


// These are required parameters in every call
var defaultConfig = {
  isSandbox: true,
  CURRENCYCODE: 'USD',
  USER: '',
  PWD: '',
  SIGNATURE: '',
  VERSION: '86'
};

// flow types for request


/**
 * @class PaypalExpressCheckout
 */

var _class = function () {
  // used for logging

  /**
   * @method constructor
   * @param { Object } config - initial config
   */

  /**
   * @property config
   */

  function _class(config) {
    _classCallCheck(this, _class);

    this._log = (0, _debug2.default)('paypal-express-checkout');
    this.setConfig(Object.assign({}, defaultConfig, config));
  }

  /**
   * @method setConfig
   * @param { Object } config - new config to set
   */


  /**
   * @property _log
   */


  _createClass(_class, [{
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = Object.assign({}, this.config, config);
      this._log('%s mode set', this.config.isSandbox ? 'Sandbox' : 'Production');
    }

    /**
     * @method _getAPIEndpoint
     * @private
     * @returns {string} paypal API endpoint from config
     */

  }, {
    key: '_getAPIEndpoint',
    value: function _getAPIEndpoint() {
      return this.config.isSandbox ? 'https://api-3t.sandbox.paypal.com/nvp' : 'https://api-3t.paypal.com/nvp';
    }

    /**
     * @method _getRequestParams
     * @private
     * @param {string} method - api method
     * @param {Object} params - key,value based parameter list for api
     * @returns {PaypalECRequestParamType} parameter object for paypal express checkout call
     */

  }, {
    key: '_getRequestParams',
    value: function _getRequestParams(method, params) {
      return _extends({
        USER: this.config.USER,
        PWD: this.config.PWD,
        VERSION: this.config.VERSION,
        SIGNATURE: this.config.SIGNATURE,
        METHOD: method
      }, params);
    }

    /**
     * @method call
     * @param {string} method - api method
     * @param {Object} params - key,value based parameter list for api
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'call',
    value: function call(method, params) {
      var _this = this;

      var uri = this._getAPIEndpoint();
      var form = this._getRequestParams(method, params);

      return new Promise(function (resolve, reject) {
        _this._log('POST ' + uri);
        _this._log('Form ' + JSON.stringify(form, null, 2));

        _request2.default.post({
          uri: uri,
          form: form
        }, function (err, httpResp, responseBody) {
          var result = {
            errorCode: null,
            responseBody: responseBody,
            statusCode: httpResp.statusCode,
            result: _querystring2.default.parse(responseBody)
          };

          _this._log('Response http status ' + result.statusCode);
          _this._log('Response error code ' + result.errorCode);
          _this._log('Response result ' + JSON.stringify(result.result, null, 2));

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

  }, {
    key: 'getUrlFromToken',
    value: function getUrlFromToken(token) {
      var sandboxText = this.config.isSandbox ? '.sandbox' : '';
      return 'https://www' + sandboxText + '.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + token;
    }

    // ==============================================
    // Functions for parallel payment
    // ==============================================
    /**
     * @method _getPaymentRequestForm
     * @param {Array<PaypalECPaymentType>} paymentData - multiple payment info for parallel payment
     * @returns {Object} payment form data
     */

  }, {
    key: '_getPaymentRequestForm',
    value: function _getPaymentRequestForm() {
      var _this2 = this;

      var paymentData = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var formData = {};
      this._log(paymentData.length + ' parallel payments to do');

      paymentData.forEach(function (payment, index) {
        formData['PAYMENTREQUEST_' + index + '_CURRENCYCODE'] = _this2.config.CURRENCYCODE;

        Object.keys(payment).forEach(function (key) {
          if (key !== 'items') {
            formData['PAYMENTREQUEST_' + index + '_' + key] = payment[key];
          }
        });

        if (payment.items) {
          _this2._log(payment.items.length + ' items presents in payment no.' + index);
          payment.items.forEach(function (item, itemIndex) {
            Object.keys(item).forEach(function (key) {
              formData['L_PAYMENTREQUEST_' + index + '_' + key + itemIndex] = item[key];
            });
          });
        }
      });

      return formData;
    }

    /**
     * @method getExpressCheckoutDetails
     * @param {string} token - auth token
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'getExpressCheckoutDetails',
    value: function getExpressCheckoutDetails(token) {
      var params = {
        TOKEN: token
      };
      return this.call('GetExpressCheckoutDetails', params);
    }

    /**
     * @method setExpressCheckout
     * @param {Array<PaypalECPaymentType>} paymentData - multiple payment info for parallel payment
     * @param {string} returnUrl - success callback url
     * @param {string} cancelUrl - cancel callback url
     * @param {string} additionalParams - additional parameters
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'setExpressCheckout',
    value: function setExpressCheckout(paymentData, returnUrl, cancelUrl) {
      var additionalParams = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var params = Object.assign(_extends({
        VERSION: '93',
        cancelUrl: cancelUrl,
        returnUrl: returnUrl
      }, additionalParams), this._getPaymentRequestForm(paymentData));
      return this.call('SetExpressCheckout', params);
    }

    /**
     * @method doExpressCheckoutPayment
     * @param {string} token - auth token
     * @param {string} payerID - payerId returned from getExpressCheckoutDetails
     * @param {Array<PaypalECPaymentType>} paymentData - multiple payment info for parallel payment
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'doExpressCheckoutPayment',
    value: function doExpressCheckoutPayment(token, payerID, paymentData) {
      // we only use necessary information from payment data
      var tunedPaymentData = paymentData.map(function (payment) {
        var AMT = payment.AMT;
        var PAYMENTREQUESTID = payment.PAYMENTREQUESTID;
        var SELLERPAYPALACCOUNTID = payment.SELLERPAYPALACCOUNTID;

        var data = {
          AMT: AMT,
          PAYMENTREQUESTID: PAYMENTREQUESTID,
          SELLERPAYPALACCOUNTID: SELLERPAYPALACCOUNTID
        };
        return data;
      });

      var params = Object.assign({
        VERSION: '93',
        TOKEN: token,
        PAYERID: payerID
      }, this._getPaymentRequestForm(tunedPaymentData));
      return this.call('DoExpressCheckoutPayment', params);
    }

    // ==============================================
    // Functions for reference payment
    // ==============================================
    /**
     * @method getBillingAuthorizationToken
     * @param {string} billingType - type of billing agreement
     * @param {string} billingDesription - billing agreement description
     * @param {string} returnUrl - success callback url
     * @param {string} cancelUrl - cancel callback url
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'getReferenceAuthToken',
    value: function getReferenceAuthToken(billingType, billingDesription, returnUrl, cancelUrl) {
      var params = [{
        PAYMENTACTION: 'AUTHORIZATION',
        AMT: 0
      }];

      return this.setExpressCheckout(params, returnUrl, cancelUrl, {
        L_BILLINGTYPE0: billingType,
        L_BILLINGAGREEMENTDESCRIPTION0: billingDesription,
        VERSION: '86'
      });
    }

    /**
     * @method createBillingAgreement
     * @param {string} token - auth token created from getBillingAuthorizationToken
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'createBillingAgreement',
    value: function createBillingAgreement(token) {
      var params = {
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

  }, {
    key: 'doReferenceTransaction',
    value: function doReferenceTransaction(amount, paymentAction, referenceID) {
      var params = {
        AMT: amount,
        PAYMENTACTION: paymentAction,
        REFERENCEID: referenceID
      };
      return this.call('DoReferenceTransaction', params);
    }
  }]);

  return _class;
}();

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,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QixlQUFPO0FBRGMsT0FBdkI7QUFHQSxhQUFPLEtBQUssSUFBTCxDQUFVLHdCQUFWLEVBQW9DLE1BQXBDLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7OzJDQVNzQixNLEVBQWdCLGEsRUFBdUIsVyxFQUFrRDtBQUM5RyxVQUFNLFNBQWlCO0FBQ3JCLGFBQUssTUFEZ0I7QUFFckIsdUJBQWUsYUFGTTtBQUdyQixxQkFBYTtBQUhRLE9BQXZCO0FBS0EsYUFBTyxLQUFLLElBQUwsQ0FBVSx3QkFBVixFQUFvQyxNQUFwQyxDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgUVMgZnJvbSAncXVlcnlzdHJpbmcnO1xuaW1wb3J0IGRlYnVnTGliIGZyb20gJ2RlYnVnJztcblxuZXhwb3J0IHR5cGUgUGF5cGFsRUNDb25maWdUeXBlID0ge1xuICBpc1NhbmRib3g6IGJvb2wsIC8vIHRydWUgPSBzYW5kYm94LCBmYWxzZSA9IHByb2RcbiAgQ1VSUkVOQ1lDT0RFOiBzdHJpbmcsIC8vIFVTRFxuICBVU0VSOiBzdHJpbmcsIC8vIGFwaSB1c2VyIG5hbWVcbiAgUFdEOiBzdHJpbmcsIC8vIGFwaSBwYXNzd29yZFxuICBTSUdOQVRVUkU6IHN0cmluZywgLy8gYXBpIHNpZ25hdHVyZVxuICBWRVJTSU9OOiBzdHJpbmcgLy8gdmVyc2lvbiBvZiBhcGlcbn07XG5cbi8vIFRoZXNlIGFyZSByZXF1aXJlZCBwYXJhbWV0ZXJzIGluIGV2ZXJ5IGNhbGxcbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSA9IHtcbiAgVVNFUjogc3RyaW5nLFxuICBQV0Q6IHN0cmluZyxcbiAgU0lHTkFUVVJFOiBzdHJpbmcsXG4gIE1FVEhPRDogc3RyaW5nLFxuICBWRVJTSU9OOiBzdHJpbmdcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVzdWx0VHlwZSA9IHtcbiAgZXJyb3JDb2RlOiA/c3RyaW5nLFxuICBzdGF0dXNDb2RlOiBudW1iZXIsXG4gIHJlc3BvbnNlQm9keTogc3RyaW5nLFxuICByZXN1bHQ6ID9PYmplY3Rcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUGF5bWVudEl0ZW1UeXBlID0ge1xuICBOQU1FOiBzdHJpbmcsIC8vIGl0ZW0gbmFtZVxuICBRVFk6IG51bWJlciwgLy8gdG90YWwgcXVhbnRpdHkgb2YgdGhlIGl0ZW1zXG4gIEFNVDogbnVtYmVyLCAvLyBwcmljZSBvZiBhbiBpdGVtXG4gIFRBWEFNVDogP251bWJlciwgLy8gdGF4IGFtb3VudCBvZiBhbiBpdGVtXG4gIERFU0M6ID9zdHJpbmcsIC8vIGl0ZW0gZGVzY3JpcHRpb25cbiAgTlVNQkVSOiA/c3RyaW5nIC8vIGl0ZW0gbnVtYmVyIGdlbmVyYXRlZCBieSB5b3Vcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUGF5bWVudFR5cGUgPSB7XG4gIEFNVDogbnVtYmVyLCAvLyB0b3RhbCAkIGFtb3VudCBvZiB0aGUgcGF5bWVudFxuICBJVEVNQU1UOiA/bnVtYmVyLCAvLyB0b3RhbCBhbW91bnQgb2YgdGhlIGl0ZW1cblxuICBUQVhBTVQ6ID9udW1iZXIsIC8vIHRvdGFsIGFtb3VudCBvZiB0YXhcbiAgU0hJUFBJTkdBTVQ6ID9udW1iZXIsIC8vIHRvdGFsIGFtb3VudCBvZiBzaGlwcGluZ1xuICBIQU5ETElOR0FNVDogP251bWJlciwgLy8gdG90YWwgYW1vdW50IG9mIHNoaXBpbmcgaGFuZGxpbmdcbiAgU0hJUERJU0NBTVQ6ID9udW1iZXIsIC8vIHRvdGFsIGFtb3VudCBvZiBzaGlwcGluZyBkaXNjb3VudFxuICBJTlNVUkFOQ0VBTVQ6ID9udW1iZXIsIC8vIHRvdGFsIGFtb3VudCBvZiBpbnN1cmFuY2VcblxuICBQQVlNRU5UQUNUSU9OOiBzdHJpbmcsIC8vIHBheW1lbnQgYWN0aW9uIC0gU2FsZSwgT3JkZXIsIEF1dGhvcml6YXRpb24gLi4uLlxuICBTRUxMRVJQQVlQQUxBQ0NPVU5USUQ6ID9zdHJpbmcsIC8vIHBheXBhbCBlbWFpbCBvZiBzZWxsZXJcbiAgUEFZTUVOVFJFUVVFU1RJRDogP3N0cmluZywgLy8gdW5pcXVlIGlkIGdlbmVyYXRlZCBieSB5b3UgZm9yIHRyYWNraW5nIHBheW1lbnRcblxuICBERVNDOiA/c3RyaW5nLCAvLyBnZW5lcmljIGRlc2NyaXB0aW9uIGZvciB0aGUgcGF5bWVudFxuXG4gIGl0ZW1zOiA/QXJyYXk8UGF5cGFsRUNQYXltZW50SXRlbVR5cGU+IC8vIGl0ZW1zIGluIGRldGFpbFxufTtcblxuLy8gZGVmYXVsdCBjb25maWdcbmNvbnN0IGRlZmF1bHRDb25maWc6IFBheXBhbEVDQ29uZmlnVHlwZSA9IHtcbiAgaXNTYW5kYm94OiB0cnVlLFxuICBDVVJSRU5DWUNPREU6ICdVU0QnLFxuICBVU0VSOiAnJyxcbiAgUFdEOiAnJyxcbiAgU0lHTkFUVVJFOiAnJyxcbiAgVkVSU0lPTjogJzg2J1xufTtcblxuLy8gZmxvdyB0eXBlcyBmb3IgcmVxdWVzdFxudHlwZSBSZXF1ZXN0RXJyb3JUeXBlID0ge1xuICBjb2RlOiBzdHJpbmdcbn07XG5cbnR5cGUgUmVxdWVzdEh0dHBSZXNwb25zZVR5cGUgPSB7XG4gIHN0YXR1c0NvZGU6IG51bWJlclxufTtcblxuLyoqXG4gKiBAY2xhc3MgUGF5cGFsRXhwcmVzc0NoZWNrb3V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBjb25maWdcbiAgICovXG4gIGNvbmZpZzogUGF5cGFsRUNDb25maWdUeXBlXG5cbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBfbG9nXG4gICAqL1xuICBfbG9nOiBGdW5jdGlvbiAgLy8gdXNlZCBmb3IgbG9nZ2luZ1xuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIGluaXRpYWwgY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdCkge1xuICAgIHRoaXMuX2xvZyA9IGRlYnVnTGliKCdwYXlwYWwtZXhwcmVzcy1jaGVja291dCcpO1xuICAgIHRoaXMuc2V0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRDb25maWcsIGNvbmZpZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0Q29uZmlnXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIG5ldyBjb25maWcgdG8gc2V0XG4gICAqL1xuICBzZXRDb25maWcoY29uZmlnOiBPYmplY3QpIHtcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLCBjb25maWcpO1xuICAgIHRoaXMuX2xvZygnJXMgbW9kZSBzZXQnLCB0aGlzLmNvbmZpZy5pc1NhbmRib3ggPyAnU2FuZGJveCcgOiAnUHJvZHVjdGlvbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldEFQSUVuZHBvaW50XG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBheXBhbCBBUEkgZW5kcG9pbnQgZnJvbSBjb25maWdcbiAgICovXG4gIF9nZXRBUElFbmRwb2ludCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5pc1NhbmRib3ggPyAnaHR0cHM6Ly9hcGktM3Quc2FuZGJveC5wYXlwYWwuY29tL252cCcgOiAnaHR0cHM6Ly9hcGktM3QucGF5cGFsLmNvbS9udnAnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldFJlcXVlc3RQYXJhbXNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIGFwaSBtZXRob2RcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIGtleSx2YWx1ZSBiYXNlZCBwYXJhbWV0ZXIgbGlzdCBmb3IgYXBpXG4gICAqIEByZXR1cm5zIHtQYXlwYWxFQ1JlcXVlc3RQYXJhbVR5cGV9IHBhcmFtZXRlciBvYmplY3QgZm9yIHBheXBhbCBleHByZXNzIGNoZWNrb3V0IGNhbGxcbiAgICovXG4gIF9nZXRSZXF1ZXN0UGFyYW1zKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IE9iamVjdCk6IFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFVTRVI6IHRoaXMuY29uZmlnLlVTRVIsXG4gICAgICBQV0Q6IHRoaXMuY29uZmlnLlBXRCxcbiAgICAgIFZFUlNJT046IHRoaXMuY29uZmlnLlZFUlNJT04sXG4gICAgICBTSUdOQVRVUkU6IHRoaXMuY29uZmlnLlNJR05BVFVSRSxcbiAgICAgIE1FVEhPRDogbWV0aG9kLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNhbGxcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIGFwaSBtZXRob2RcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIGtleSx2YWx1ZSBiYXNlZCBwYXJhbWV0ZXIgbGlzdCBmb3IgYXBpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT59IHByb21pc2Ugb2YgYXBpIGNhbGwgcmVzdWx0XG4gICAqL1xuICBjYWxsKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IE9iamVjdCk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgdXJpOiBzdHJpbmcgPSB0aGlzLl9nZXRBUElFbmRwb2ludCgpO1xuICAgIGNvbnN0IGZvcm06IFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSA9IHRoaXMuX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBGdW5jdGlvbiwgcmVqZWN0OiBGdW5jdGlvbikgPT4ge1xuICAgICAgdGhpcy5fbG9nKGBQT1NUICR7dXJpfWApO1xuICAgICAgdGhpcy5fbG9nKGBGb3JtICR7SlNPTi5zdHJpbmdpZnkoZm9ybSwgbnVsbCwgMil9YCk7XG5cbiAgICAgIHJlcXVlc3QucG9zdCh7XG4gICAgICAgIHVyaSxcbiAgICAgICAgZm9ybVxuICAgICAgfSwgKGVycjogP1JlcXVlc3RFcnJvclR5cGUsIGh0dHBSZXNwOiBSZXF1ZXN0SHR0cFJlc3BvbnNlVHlwZSwgcmVzcG9uc2VCb2R5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBQYXlwYWxFQ1Jlc3VsdFR5cGUgPSB7XG4gICAgICAgICAgZXJyb3JDb2RlOiBudWxsLFxuICAgICAgICAgIHJlc3BvbnNlQm9keSxcbiAgICAgICAgICBzdGF0dXNDb2RlOiBodHRwUmVzcC5zdGF0dXNDb2RlLFxuICAgICAgICAgIHJlc3VsdDogUVMucGFyc2UocmVzcG9uc2VCb2R5KVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2xvZyhgUmVzcG9uc2UgaHR0cCBzdGF0dXMgJHtyZXN1bHQuc3RhdHVzQ29kZX1gKTtcbiAgICAgICAgdGhpcy5fbG9nKGBSZXNwb25zZSBlcnJvciBjb2RlICR7cmVzdWx0LmVycm9yQ29kZX1gKTtcbiAgICAgICAgdGhpcy5fbG9nKGBSZXNwb25zZSByZXN1bHQgJHtKU09OLnN0cmluZ2lmeShyZXN1bHQucmVzdWx0LCBudWxsLCAyKX1gKTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IGVyci5jb2RlO1xuICAgICAgICAgIHJlamVjdChyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBnZXRVcmxGcm9tVG9rZW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gYXV0aCB0b2tlbiBjcmVhdGVkIGZyb20gb3RoZXIgZnVuY3NcbiAgICogQHJldHVybnMge3N0cmluZ30gRnVsbCBwYXlwYWwgdXJsIHRvIHJlZGlyZWN0IHVzZXIgZm9yIGFjdGlvbnNcbiAgICovXG4gIGdldFVybEZyb21Ub2tlbih0b2tlbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzYW5kYm94VGV4dDogc3RyaW5nID0gdGhpcy5jb25maWcuaXNTYW5kYm94ID8gJy5zYW5kYm94JyA6ICcnO1xuICAgIHJldHVybiBgaHR0cHM6Ly93d3cke3NhbmRib3hUZXh0fS5wYXlwYWwuY29tL2NnaS1iaW4vd2Vic2NyP2NtZD1fZXhwcmVzcy1jaGVja291dCZ0b2tlbj0ke3Rva2VufWA7XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEZ1bmN0aW9ucyBmb3IgcGFyYWxsZWwgcGF5bWVudFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8qKlxuICAgKiBAbWV0aG9kIF9nZXRQYXltZW50UmVxdWVzdEZvcm1cbiAgICogQHBhcmFtIHtBcnJheTxQYXlwYWxFQ1BheW1lbnRUeXBlPn0gcGF5bWVudERhdGEgLSBtdWx0aXBsZSBwYXltZW50IGluZm8gZm9yIHBhcmFsbGVsIHBheW1lbnRcbiAgICogQHJldHVybnMge09iamVjdH0gcGF5bWVudCBmb3JtIGRhdGFcbiAgICovXG4gIF9nZXRQYXltZW50UmVxdWVzdEZvcm0ocGF5bWVudERhdGE6IEFycmF5PFBheXBhbEVDUGF5bWVudFR5cGU+ID0gW10pOiBPYmplY3Qge1xuICAgIGNvbnN0IGZvcm1EYXRhID0ge307XG4gICAgdGhpcy5fbG9nKGAke3BheW1lbnREYXRhLmxlbmd0aH0gcGFyYWxsZWwgcGF5bWVudHMgdG8gZG9gKTtcblxuICAgIHBheW1lbnREYXRhLmZvckVhY2goKHBheW1lbnQ6IFBheXBhbEVDUGF5bWVudFR5cGUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGZvcm1EYXRhW2BQQVlNRU5UUkVRVUVTVF8ke2luZGV4fV9DVVJSRU5DWUNPREVgXSA9IHRoaXMuY29uZmlnLkNVUlJFTkNZQ09ERTtcblxuICAgICAgT2JqZWN0LmtleXMocGF5bWVudCkuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGtleSAhPT0gJ2l0ZW1zJykge1xuICAgICAgICAgIGZvcm1EYXRhW2BQQVlNRU5UUkVRVUVTVF8ke2luZGV4fV8ke2tleX1gXSA9IHBheW1lbnRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwYXltZW50Lml0ZW1zKSB7XG4gICAgICAgIHRoaXMuX2xvZyhgJHtwYXltZW50Lml0ZW1zLmxlbmd0aH0gaXRlbXMgcHJlc2VudHMgaW4gcGF5bWVudCBuby4ke2luZGV4fWApO1xuICAgICAgICBwYXltZW50Lml0ZW1zLmZvckVhY2goKGl0ZW06IFBheXBhbEVDUGF5bWVudEl0ZW1UeXBlLCBpdGVtSW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBmb3JtRGF0YVtgTF9QQVlNRU5UUkVRVUVTVF8ke2luZGV4fV8ke2tleX0ke2l0ZW1JbmRleH1gXSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBnZXRFeHByZXNzQ2hlY2tvdXREZXRhaWxzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIGF1dGggdG9rZW5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGdldEV4cHJlc3NDaGVja291dERldGFpbHModG9rZW46IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBUT0tFTjogdG9rZW5cbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0dldEV4cHJlc3NDaGVja291dERldGFpbHMnLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0RXhwcmVzc0NoZWNrb3V0XG4gICAqIEBwYXJhbSB7QXJyYXk8UGF5cGFsRUNQYXltZW50VHlwZT59IHBheW1lbnREYXRhIC0gbXVsdGlwbGUgcGF5bWVudCBpbmZvIGZvciBwYXJhbGxlbCBwYXltZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXR1cm5VcmwgLSBzdWNjZXNzIGNhbGxiYWNrIHVybFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FuY2VsVXJsIC0gY2FuY2VsIGNhbGxiYWNrIHVybFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWRkaXRpb25hbFBhcmFtcyAtIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+fSBwcm9taXNlIG9mIGFwaSBjYWxsIHJlc3VsdFxuICAgKi9cbiAgc2V0RXhwcmVzc0NoZWNrb3V0KHBheW1lbnREYXRhOiBBcnJheTxQYXlwYWxFQ1BheW1lbnRUeXBlPiwgcmV0dXJuVXJsOiBzdHJpbmcsIGNhbmNlbFVybDogc3RyaW5nLCBhZGRpdGlvbmFsUGFyYW1zOiBPYmplY3QgPSB7fSlcbiAgOiBQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT4ge1xuICAgIGNvbnN0IHBhcmFtczogT2JqZWN0ID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBWRVJTSU9OOiAnOTMnLFxuICAgICAgY2FuY2VsVXJsLFxuICAgICAgcmV0dXJuVXJsLFxuICAgICAgLi4uYWRkaXRpb25hbFBhcmFtc1xuICAgIH0sIHRoaXMuX2dldFBheW1lbnRSZXF1ZXN0Rm9ybShwYXltZW50RGF0YSkpO1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ1NldEV4cHJlc3NDaGVja291dCcsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBkb0V4cHJlc3NDaGVja291dFBheW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gYXV0aCB0b2tlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5ZXJJRCAtIHBheWVySWQgcmV0dXJuZWQgZnJvbSBnZXRFeHByZXNzQ2hlY2tvdXREZXRhaWxzXG4gICAqIEBwYXJhbSB7QXJyYXk8UGF5cGFsRUNQYXltZW50VHlwZT59IHBheW1lbnREYXRhIC0gbXVsdGlwbGUgcGF5bWVudCBpbmZvIGZvciBwYXJhbGxlbCBwYXltZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT59IHByb21pc2Ugb2YgYXBpIGNhbGwgcmVzdWx0XG4gICAqL1xuICBkb0V4cHJlc3NDaGVja291dFBheW1lbnQodG9rZW46IHN0cmluZywgcGF5ZXJJRDogc3RyaW5nLCBwYXltZW50RGF0YTogQXJyYXk8UGF5cGFsRUNQYXltZW50VHlwZT4pXG4gIDogUHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+IHtcbiAgICAvLyB3ZSBvbmx5IHVzZSBuZWNlc3NhcnkgaW5mb3JtYXRpb24gZnJvbSBwYXltZW50IGRhdGFcbiAgICBjb25zdCB0dW5lZFBheW1lbnREYXRhID0gcGF5bWVudERhdGEubWFwKChwYXltZW50OiBQYXlwYWxFQ1BheW1lbnRUeXBlKTogUGF5cGFsRUNQYXltZW50VHlwZSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIEFNVCxcbiAgICAgICAgUEFZTUVOVFJFUVVFU1RJRCxcbiAgICAgICAgU0VMTEVSUEFZUEFMQUNDT1VOVElEXG4gICAgICB9ID0gcGF5bWVudDtcbiAgICAgIGNvbnN0IGRhdGE6IFBheXBhbEVDUGF5bWVudFR5cGUgPSB7XG4gICAgICAgIEFNVCxcbiAgICAgICAgUEFZTUVOVFJFUVVFU1RJRCxcbiAgICAgICAgU0VMTEVSUEFZUEFMQUNDT1VOVElEXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXJhbXM6IE9iamVjdCA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgVkVSU0lPTjogJzkzJyxcbiAgICAgIFRPS0VOOiB0b2tlbixcbiAgICAgIFBBWUVSSUQ6IHBheWVySURcbiAgICB9LCB0aGlzLl9nZXRQYXltZW50UmVxdWVzdEZvcm0odHVuZWRQYXltZW50RGF0YSkpO1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0RvRXhwcmVzc0NoZWNrb3V0UGF5bWVudCcsIHBhcmFtcyk7XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEZ1bmN0aW9ucyBmb3IgcmVmZXJlbmNlIHBheW1lbnRcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvKipcbiAgICogQG1ldGhvZCBnZXRCaWxsaW5nQXV0aG9yaXphdGlvblRva2VuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiaWxsaW5nVHlwZSAtIHR5cGUgb2YgYmlsbGluZyBhZ3JlZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJpbGxpbmdEZXNyaXB0aW9uIC0gYmlsbGluZyBhZ3JlZW1lbnQgZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHJldHVyblVybCAtIHN1Y2Nlc3MgY2FsbGJhY2sgdXJsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYW5jZWxVcmwgLSBjYW5jZWwgY2FsbGJhY2sgdXJsXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT59IHByb21pc2Ugb2YgYXBpIGNhbGwgcmVzdWx0XG4gICAqL1xuICBnZXRSZWZlcmVuY2VBdXRoVG9rZW4oYmlsbGluZ1R5cGU6IHN0cmluZywgYmlsbGluZ0Rlc3JpcHRpb246IHN0cmluZywgcmV0dXJuVXJsOiBzdHJpbmcsIGNhbmNlbFVybDogc3RyaW5nKTogUHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCBwYXJhbXM6IEFycmF5PFBheXBhbEVDUGF5bWVudFR5cGU+ID0gW3tcbiAgICAgIFBBWU1FTlRBQ1RJT046ICdBVVRIT1JJWkFUSU9OJyxcbiAgICAgIEFNVDogMFxuICAgIH1dO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0RXhwcmVzc0NoZWNrb3V0KHBhcmFtcywgcmV0dXJuVXJsLCBjYW5jZWxVcmwsIHtcbiAgICAgIExfQklMTElOR1RZUEUwOiBiaWxsaW5nVHlwZSxcbiAgICAgIExfQklMTElOR0FHUkVFTUVOVERFU0NSSVBUSU9OMDogYmlsbGluZ0Rlc3JpcHRpb24sXG4gICAgICBWRVJTSU9OOiAnODYnXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjcmVhdGVCaWxsaW5nQWdyZWVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIGF1dGggdG9rZW4gY3JlYXRlZCBmcm9tIGdldEJpbGxpbmdBdXRob3JpemF0aW9uVG9rZW5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGNyZWF0ZUJpbGxpbmdBZ3JlZW1lbnQodG9rZW46IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBUT0tFTjogdG9rZW5cbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0NyZWF0ZUJpbGxpbmdBZ3JlZW1lbnQnLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZG9SZWZlcmVuY2VUcmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gYW1vdW50IC0gbW9uZXkgdG8gY2FwdHVyZSBmcm9tIGN1c3RvbWVyJ3MgYWNjb3VudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bWVudEFjdGlvbiAtIHR5cGUgb2YgcGF5bWVudFxuICAgKiBAcGFyYW0ge3JlZmVyZW5jZUlEfSAtIGJpbGxpbmcgaWQgY3JlYXRlZCB3aXRoIGNyZWF0ZUJpbGxpbmdBZ3JlZW1lbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGRvUmVmZXJlbmNlVHJhbnNhY3Rpb24oYW1vdW50OiBudW1iZXIsIHBheW1lbnRBY3Rpb246IHN0cmluZywgcmVmZXJlbmNlSUQ6IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBBTVQ6IGFtb3VudCxcbiAgICAgIFBBWU1FTlRBQ1RJT046IHBheW1lbnRBY3Rpb24sXG4gICAgICBSRUZFUkVOQ0VJRDogcmVmZXJlbmNlSURcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0RvUmVmZXJlbmNlVHJhbnNhY3Rpb24nLCBwYXJhbXMpO1xuICB9XG59XG4iXX0=