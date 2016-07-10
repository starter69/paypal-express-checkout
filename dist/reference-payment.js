'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class PaypalExpressCheckout/ReferencePayment
 */

var _class = function (_PaypalExpressCheckou) {
  _inherits(_class, _PaypalExpressCheckou);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'getAuthorizationToken',

    /**
     * @method getBillingAuthorizationToken
     * @param {string} billingType - type of billing agreement
     * @param {string} billingDesription - billing agreement description
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */
    value: function getAuthorizationToken(billingType, billingDesription) {
      var params = {
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
}(_index2.default);

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZmVyZW5jZS1wYXltZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MENBYXdCLFcsRUFBcUIsaUIsRUFBd0Q7QUFDakcsVUFBTSxTQUFpQjtBQUNyQix3Q0FBZ0MsZUFEWDtBQUVyQiw4QkFBc0IsQ0FGRDtBQUdyQix1Q0FBK0IsS0FBSyxNQUFMLENBQVksWUFIdEI7QUFJckIsd0JBQWdCLFdBSks7QUFLckIsd0NBQWdDLGlCQUxYO0FBTXJCLGlCQUFTO0FBTlksT0FBdkI7O0FBU0EsYUFBTyxLQUFLLElBQUwsQ0FBVSxvQkFBVixFQUFnQyxNQUFoQyxDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7MkNBT3NCLEssRUFBNEM7QUFDakUsVUFBTSxTQUFpQjtBQUNyQixlQUFPO0FBRGMsT0FBdkI7QUFHQSxhQUFPLEtBQUssSUFBTCxDQUFVLHdCQUFWLEVBQW9DLE1BQXBDLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7OzJDQVNzQixNLEVBQWdCLGEsRUFBdUIsVyxFQUFrRDtBQUM5RyxVQUFNLFNBQWlCO0FBQ3JCLGFBQUssTUFEZ0I7QUFFckIsdUJBQWUsYUFGTTtBQUdyQixxQkFBYTtBQUhRLE9BQXZCO0FBS0EsYUFBTyxLQUFLLElBQUwsQ0FBVSx3QkFBVixFQUFvQyxNQUFwQyxDQUFQO0FBQ0QiLCJmaWxlIjoicmVmZXJlbmNlLXBheW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFBheXBhbEV4cHJlc3NDaGVja291dCBmcm9tICcuL2luZGV4JztcbmltcG9ydCB0eXBlIHsgUGF5cGFsRUNSZXN1bHRUeXBlIH0gZnJvbSAnLi9pbmRleCc7XG5cbi8qKlxuICogQGNsYXNzIFBheXBhbEV4cHJlc3NDaGVja291dC9SZWZlcmVuY2VQYXltZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUGF5cGFsRXhwcmVzc0NoZWNrb3V0IHtcbiAgLyoqXG4gICAqIEBtZXRob2QgZ2V0QmlsbGluZ0F1dGhvcml6YXRpb25Ub2tlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmlsbGluZ1R5cGUgLSB0eXBlIG9mIGJpbGxpbmcgYWdyZWVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiaWxsaW5nRGVzcmlwdGlvbiAtIGJpbGxpbmcgYWdyZWVtZW50IGRlc2NyaXB0aW9uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT59IHByb21pc2Ugb2YgYXBpIGNhbGwgcmVzdWx0XG4gICAqL1xuICBnZXRBdXRob3JpemF0aW9uVG9rZW4oYmlsbGluZ1R5cGU6IHN0cmluZywgYmlsbGluZ0Rlc3JpcHRpb246IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBQQVlNRU5UUkVRVUVTVF8wX1BBWU1FTlRBQ1RJT046ICdBVVRIT1JJWkFUSU9OJyxcbiAgICAgIFBBWU1FTlRSRVFVRVNUXzBfQU1UOiAwLFxuICAgICAgUEFZTUVOVFJFUVVFU1RfMF9DVVJSRU5DWUNPREU6IHRoaXMuY29uZmlnLkNVUlJFTkNZQ09ERSxcbiAgICAgIExfQklMTElOR1RZUEUwOiBiaWxsaW5nVHlwZSxcbiAgICAgIExfQklMTElOR0FHUkVFTUVOVERFU0NSSVBUSU9OMDogYmlsbGluZ0Rlc3JpcHRpb24sXG4gICAgICBWRVJTSU9OOiAnODYnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmNhbGwoJ1NldEV4cHJlc3NDaGVja291dCcsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjcmVhdGVCaWxsaW5nQWdyZWVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIGF1dGggdG9rZW4gY3JlYXRlZCBmcm9tIGdldEJpbGxpbmdBdXRob3JpemF0aW9uVG9rZW5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGNyZWF0ZUJpbGxpbmdBZ3JlZW1lbnQodG9rZW46IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBUT0tFTjogdG9rZW5cbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0NyZWF0ZUJpbGxpbmdBZ3JlZW1lbnQnLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZG9SZWZlcmVuY2VUcmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gYW1vdW50IC0gbW9uZXkgdG8gY2FwdHVyZSBmcm9tIGN1c3RvbWVyJ3MgYWNjb3VudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bWVudEFjdGlvbiAtIHR5cGUgb2YgcGF5bWVudFxuICAgKiBAcGFyYW0ge3JlZmVyZW5jZUlEfSAtIGJpbGxpbmcgaWQgY3JlYXRlZCB3aXRoIGNyZWF0ZUJpbGxpbmdBZ3JlZW1lbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGRvUmVmZXJlbmNlVHJhbnNhY3Rpb24oYW1vdW50OiBudW1iZXIsIHBheW1lbnRBY3Rpb246IHN0cmluZywgcmVmZXJlbmNlSUQ6IHN0cmluZyk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgICBBTVQ6IGFtb3VudCxcbiAgICAgIFBBWU1FTlRBQ1RJT046IHBheW1lbnRBY3Rpb24sXG4gICAgICBSRUZFUkVOQ0VJRDogcmVmZXJlbmNlSURcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbGwoJ0RvUmVmZXJlbmNlVHJhbnNhY3Rpb24nLCBwYXJhbXMpO1xuICB9XG59XG4iXX0=