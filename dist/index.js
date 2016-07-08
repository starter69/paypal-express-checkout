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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// default config


// flow type for paypal express checkout
var defaultConfig = {
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


/**
 * @class PaypalExpressCheckout
 */

var _class = function () {

  /**
   * @method constructor
   * @param { Object } config - initial config
   */

  function _class(config) {
    _classCallCheck(this, _class);

    this.setConfig(Object.assign({}, defaultConfig, config));
  }

  /**
   * @method setConfig
   * @param { Object } config - new config to set
   */

  /**
   * @property config
   */


  _createClass(_class, [{
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = Object.assign({}, this.config, config);
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
     * @param {PaypalECMethodType} method - api method
     * @param {Object} params - key,value based parameter list for api
     * @returns {PaypalECRequestParamType} parameter object for paypal express checkout call
     */

  }, {
    key: '_getRequestParams',
    value: function _getRequestParams(method, params) {
      return _extends({}, params, {
        USER: this.config.user,
        PWD: this.config.password,
        VERSION: this.config.version,
        SIGNATURE: this.config.signature,
        METHOD: method
      });
    }

    /**
     * @method call
     * @param {PaypalECMethodType} method - api method
     * @param {Object} params - key,value based parameter list for api
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */

  }, {
    key: 'call',
    value: function call(method, params) {
      var uri = this._getAPIEndpoint();
      var form = this._getRequestParams(method, params);

      return new Promise(function (resolve, reject) {
        _request2.default.post({
          uri: uri,
          form: form
        }, function (err, httpResp, responseBody) {
          var result = {
            errorCode: null,
            responseBody: responseBody,
            statusCode: httpResp.statusCode,
            parsedResult: _querystring2.default.parse(responseBody)
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
  }]);

  return _class;
}();

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFtQ0EsSUFBTSxnQkFBb0M7QUFDeEMsYUFBVyxJQUQ2QjtBQUV4QyxZQUFVLEtBRjhCO0FBR3hDLFFBQU0sRUFIa0M7QUFJeEMsWUFBVSxFQUo4QjtBQUt4QyxhQUFXLEVBTDZCO0FBTXhDLG9CQUFrQixFQU5zQjtBQU94QyxvQkFBa0IsRUFQc0I7QUFReEMsV0FBUztBQVIrQixDQUExQzs7Ozs7Ozs7Ozs7Ozs7OztBQWlDRSxrQkFBWSxNQUFaLEVBQTRCO0FBQUE7O0FBQzFCLFNBQUssU0FBTCxDQUFlLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsYUFBbEIsRUFBaUMsTUFBakMsQ0FBZjtBQUNEOzs7Ozs7Ozs7Ozs7Ozs4QkFNUyxNLEVBQWdCO0FBQ3hCLFdBQUssTUFBTCxHQUFjLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBSyxNQUF2QixFQUErQixNQUEvQixDQUFkO0FBQ0Q7Ozs7Ozs7Ozs7c0NBT3lCO0FBQ3hCLGFBQU8sS0FBSyxNQUFMLENBQVksU0FBWixHQUF3Qix1Q0FBeEIsR0FBa0UsK0JBQXpFO0FBQ0Q7Ozs7Ozs7Ozs7OztzQ0FTaUIsTSxFQUE0QixNLEVBQTBDO0FBQ3RGLDBCQUNLLE1BREw7QUFFRSxjQUFNLEtBQUssTUFBTCxDQUFZLElBRnBCO0FBR0UsYUFBSyxLQUFLLE1BQUwsQ0FBWSxRQUhuQjtBQUlFLGlCQUFTLEtBQUssTUFBTCxDQUFZLE9BSnZCO0FBS0UsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FMekI7QUFNRSxnQkFBUTtBQU5WO0FBUUQ7Ozs7Ozs7Ozs7O3lCQVFJLE0sRUFBNEIsTSxFQUE2QztBQUM1RSxVQUFNLE1BQWMsS0FBSyxlQUFMLEVBQXBCO0FBQ0EsVUFBTSxPQUFpQyxLQUFLLGlCQUFMLENBQXVCLE1BQXZCLEVBQStCLE1BQS9CLENBQXZDOztBQUVBLGFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQW9CLE1BQXBCLEVBQXlDO0FBQzFELDBCQUFRLElBQVIsQ0FBYTtBQUNYLGtCQURXO0FBRVg7QUFGVyxTQUFiLEVBR0csVUFBQyxHQUFELEVBQXlCLFFBQXpCLEVBQTRELFlBQTVELEVBQXFGO0FBQ3RGLGNBQU0sU0FBNkI7QUFDakMsdUJBQVcsSUFEc0I7QUFFakMsc0NBRmlDO0FBR2pDLHdCQUFZLFNBQVMsVUFIWTtBQUlqQywwQkFBYyxzQkFBRyxLQUFILENBQVMsWUFBVDtBQUptQixXQUFuQzs7QUFPQSxjQUFJLEdBQUosRUFBUztBQUNQLG1CQUFPLFNBQVAsR0FBbUIsSUFBSSxJQUF2QjtBQUNBLG1CQUFPLE1BQVA7QUFDRCxXQUhELE1BR087QUFDTCxvQkFBUSxNQUFSO0FBQ0Q7QUFDRixTQWpCRDtBQWtCRCxPQW5CTSxDQUFQO0FBb0JEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IFFTIGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuLy8gZmxvdyB0eXBlIGZvciBwYXlwYWwgZXhwcmVzcyBjaGVja291dFxuZXhwb3J0IHR5cGUgUGF5cGFsRUNDb25maWdUeXBlID0ge1xuICBpc1NhbmRib3g6IGJvb2wsXG4gIGN1cnJlbmN5OiBzdHJpbmcsXG4gIHVzZXI6IHN0cmluZyxcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgc2lnbmF0dXJlOiBzdHJpbmcsXG4gIGRlZmF1bHRSZXR1cm5Vcmw6IHN0cmluZyxcbiAgZGVmYXVsdENhbmNlbFVybDogc3RyaW5nLFxuICB2ZXJzaW9uOiBudW1iZXJcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDTWV0aG9kVHlwZSA9ICdTZXRFeHByZXNzQ2hlY2tvdXQnIHxcbiAgJ0dldEV4cHJlc3NDaGVja291dERldGFpbHMnIHxcbiAgJ0RvRXhwcmVzc0NoZWNrb3V0UGF5bWVudCc7XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSA9IHtcbiAgVVNFUjogc3RyaW5nLFxuICBQV0Q6IHN0cmluZyxcbiAgU0lHTkFUVVJFOiBzdHJpbmcsXG4gIE1FVEhPRDogc3RyaW5nLFxuICBWRVJTSU9OOiBudW1iZXJcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVzdWx0VHlwZSA9IHtcbiAgZXJyb3JDb2RlOiA/c3RyaW5nLFxuICBzdGF0dXNDb2RlOiBudW1iZXIsXG4gIHJlc3BvbnNlQm9keTogc3RyaW5nLFxuICBwYXJzZWRSZXN1bHQ6ID9PYmplY3Rcbn07XG5cblxuLy8gZGVmYXVsdCBjb25maWdcbmNvbnN0IGRlZmF1bHRDb25maWc6IFBheXBhbEVDQ29uZmlnVHlwZSA9IHtcbiAgaXNTYW5kYm94OiB0cnVlLFxuICBjdXJyZW5jeTogJ1VTRCcsXG4gIHVzZXI6ICcnLFxuICBwYXNzd29yZDogJycsXG4gIHNpZ25hdHVyZTogJycsXG4gIGRlZmF1bHRSZXR1cm5Vcmw6ICcnLFxuICBkZWZhdWx0Q2FuY2VsVXJsOiAnJyxcbiAgdmVyc2lvbjogODZcbn07XG5cbi8vIGZsb3cgdHlwZXMgZm9yIHJlcXVlc3RcbnR5cGUgUmVxdWVzdEVycm9yVHlwZSA9IHtcbiAgY29kZTogc3RyaW5nXG59O1xuXG50eXBlIFJlcXVlc3RIdHRwUmVzcG9uc2VUeXBlID0ge1xuICBzdGF0dXNDb2RlOiBudW1iZXJcbn07XG5cbi8qKlxuICogQGNsYXNzIFBheXBhbEV4cHJlc3NDaGVja291dFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIC8qKlxuICAgKiBAcHJvcGVydHkgY29uZmlnXG4gICAqL1xuICBjb25maWc6IFBheXBhbEVDQ29uZmlnVHlwZVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIGluaXRpYWwgY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdCkge1xuICAgIHRoaXMuc2V0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRDb25maWcsIGNvbmZpZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0Q29uZmlnXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIG5ldyBjb25maWcgdG8gc2V0XG4gICAqL1xuICBzZXRDb25maWcoY29uZmlnOiBPYmplY3QpIHtcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldEFQSUVuZHBvaW50XG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBheXBhbCBBUEkgZW5kcG9pbnQgZnJvbSBjb25maWdcbiAgICovXG4gIF9nZXRBUElFbmRwb2ludCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5pc1NhbmRib3ggPyAnaHR0cHM6Ly9hcGktM3Quc2FuZGJveC5wYXlwYWwuY29tL252cCcgOiAnaHR0cHM6Ly9hcGktM3QucGF5cGFsLmNvbS9udnAnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldFJlcXVlc3RQYXJhbXNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtQYXlwYWxFQ01ldGhvZFR5cGV9IG1ldGhvZCAtIGFwaSBtZXRob2RcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIGtleSx2YWx1ZSBiYXNlZCBwYXJhbWV0ZXIgbGlzdCBmb3IgYXBpXG4gICAqIEByZXR1cm5zIHtQYXlwYWxFQ1JlcXVlc3RQYXJhbVR5cGV9IHBhcmFtZXRlciBvYmplY3QgZm9yIHBheXBhbCBleHByZXNzIGNoZWNrb3V0IGNhbGxcbiAgICovXG4gIF9nZXRSZXF1ZXN0UGFyYW1zKG1ldGhvZDogUGF5cGFsRUNNZXRob2RUeXBlLCBwYXJhbXM6IE9iamVjdCk6IFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnBhcmFtcyxcbiAgICAgIFVTRVI6IHRoaXMuY29uZmlnLnVzZXIsXG4gICAgICBQV0Q6IHRoaXMuY29uZmlnLnBhc3N3b3JkLFxuICAgICAgVkVSU0lPTjogdGhpcy5jb25maWcudmVyc2lvbixcbiAgICAgIFNJR05BVFVSRTogdGhpcy5jb25maWcuc2lnbmF0dXJlLFxuICAgICAgTUVUSE9EOiBtZXRob2RcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgY2FsbFxuICAgKiBAcGFyYW0ge1BheXBhbEVDTWV0aG9kVHlwZX0gbWV0aG9kIC0gYXBpIG1ldGhvZFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0ga2V5LHZhbHVlIGJhc2VkIHBhcmFtZXRlciBsaXN0IGZvciBhcGlcbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGNhbGwobWV0aG9kOiBQYXlwYWxFQ01ldGhvZFR5cGUsIHBhcmFtczogT2JqZWN0KTogUHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCB1cmk6IHN0cmluZyA9IHRoaXMuX2dldEFQSUVuZHBvaW50KCk7XG4gICAgY29uc3QgZm9ybTogUGF5cGFsRUNSZXF1ZXN0UGFyYW1UeXBlID0gdGhpcy5fZ2V0UmVxdWVzdFBhcmFtcyhtZXRob2QsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IEZ1bmN0aW9uLCByZWplY3Q6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICB1cmksXG4gICAgICAgIGZvcm1cbiAgICAgIH0sIChlcnI6ID9SZXF1ZXN0RXJyb3JUeXBlLCBodHRwUmVzcDogUmVxdWVzdEh0dHBSZXNwb25zZVR5cGUsIHJlc3BvbnNlQm9keTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGF5cGFsRUNSZXN1bHRUeXBlID0ge1xuICAgICAgICAgIGVycm9yQ29kZTogbnVsbCxcbiAgICAgICAgICByZXNwb25zZUJvZHksXG4gICAgICAgICAgc3RhdHVzQ29kZTogaHR0cFJlc3Auc3RhdHVzQ29kZSxcbiAgICAgICAgICBwYXJzZWRSZXN1bHQ6IFFTLnBhcnNlKHJlc3BvbnNlQm9keSlcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IGVyci5jb2RlO1xuICAgICAgICAgIHJlamVjdChyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==