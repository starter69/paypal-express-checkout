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

var debug = (0, _debug2.default)('paypal-express-checkout');

// flow type for paypal express checkout


// default config
var defaultConfig = {
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
      debug('%s mode set', this.isSandbox ? 'Sandbox' : 'Production');
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
        USER: this.config.USER,
        PWD: this.config.PWD,
        VERSION: this.config.VERSION,
        SIGNATURE: this.config.SIGNATURE,
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
        debug('POST ' + uri);
        debug('Form ' + JSON.stringify(form, null, 2));

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

          debug('Response http status ' + result.statusCode);
          debug('Response error code ' + result.errorCode);
          debug('Response result ' + JSON.stringify(result.result, null, 2));

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
      var sandboxText = this.config.sandbox ? '.sandbox' : '';
      return 'https://www' + sandboxText + '.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + token;
    }
  }]);

  return _class;
}();

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxRQUFRLHFCQUFTLHlCQUFULENBQWQ7Ozs7OztBQWtDQSxJQUFNLGdCQUFvQztBQUN4QyxhQUFXLElBRDZCO0FBRXhDLGdCQUFjLEtBRjBCO0FBR3hDLFFBQU0sRUFIa0M7QUFJeEMsT0FBSyxFQUptQztBQUt4QyxhQUFXLEVBTDZCO0FBTXhDLGFBQVcsRUFONkI7QUFPeEMsYUFBVyxFQVA2QjtBQVF4QyxXQUFTO0FBUitCLENBQTFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBaUNFLGtCQUFZLE1BQVosRUFBNEI7QUFBQTs7QUFDMUIsU0FBSyxTQUFMLENBQWUsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixhQUFsQixFQUFpQyxNQUFqQyxDQUFmO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7OzhCQU1TLE0sRUFBZ0I7QUFDeEIsV0FBSyxNQUFMLEdBQWMsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLLE1BQXZCLEVBQStCLE1BQS9CLENBQWQ7QUFDQSxZQUFNLGFBQU4sRUFBcUIsS0FBSyxTQUFMLEdBQWlCLFNBQWpCLEdBQTZCLFlBQWxEO0FBQ0Q7Ozs7Ozs7Ozs7c0NBT3lCO0FBQ3hCLGFBQU8sS0FBSyxNQUFMLENBQVksU0FBWixHQUF3Qix1Q0FBeEIsR0FBa0UsK0JBQXpFO0FBQ0Q7Ozs7Ozs7Ozs7OztzQ0FTaUIsTSxFQUE0QixNLEVBQTBDO0FBQ3RGLDBCQUNLLE1BREw7QUFFRSxjQUFNLEtBQUssTUFBTCxDQUFZLElBRnBCO0FBR0UsYUFBSyxLQUFLLE1BQUwsQ0FBWSxHQUhuQjtBQUlFLGlCQUFTLEtBQUssTUFBTCxDQUFZLE9BSnZCO0FBS0UsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FMekI7QUFNRSxnQkFBUTtBQU5WO0FBUUQ7Ozs7Ozs7Ozs7O3lCQVFJLE0sRUFBNEIsTSxFQUE2QztBQUM1RSxVQUFNLE1BQWMsS0FBSyxlQUFMLEVBQXBCO0FBQ0EsVUFBTSxPQUFpQyxLQUFLLGlCQUFMLENBQXVCLE1BQXZCLEVBQStCLE1BQS9CLENBQXZDOztBQUVBLGFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQW9CLE1BQXBCLEVBQXlDO0FBQzFELHdCQUFjLEdBQWQ7QUFDQSx3QkFBYyxLQUFLLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLENBQTNCLENBQWQ7O0FBRUEsMEJBQVEsSUFBUixDQUFhO0FBQ1gsa0JBRFc7QUFFWDtBQUZXLFNBQWIsRUFHRyxVQUFDLEdBQUQsRUFBeUIsUUFBekIsRUFBNEQsWUFBNUQsRUFBcUY7QUFDdEYsY0FBTSxTQUE2QjtBQUNqQyx1QkFBVyxJQURzQjtBQUVqQyxzQ0FGaUM7QUFHakMsd0JBQVksU0FBUyxVQUhZO0FBSWpDLG9CQUFRLHNCQUFHLEtBQUgsQ0FBUyxZQUFUO0FBSnlCLFdBQW5DOztBQU9BLDBDQUE4QixPQUFPLFVBQXJDO0FBQ0EseUNBQTZCLE9BQU8sU0FBcEM7QUFDQSxxQ0FBeUIsS0FBSyxTQUFMLENBQWUsT0FBTyxNQUF0QixFQUE4QixJQUE5QixFQUFvQyxDQUFwQyxDQUF6Qjs7QUFFQSxjQUFJLEdBQUosRUFBUztBQUNQLG1CQUFPLFNBQVAsR0FBbUIsSUFBSSxJQUF2QjtBQUNBLG1CQUFPLE1BQVA7QUFDRCxXQUhELE1BR087QUFDTCxvQkFBUSxNQUFSO0FBQ0Q7QUFDRixTQXJCRDtBQXNCRCxPQTFCTSxDQUFQO0FBMkJEOzs7Ozs7Ozs7O29DQU9lLEssRUFBdUI7QUFDckMsVUFBTSxjQUFzQixLQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLFVBQXRCLEdBQW1DLEVBQS9EO0FBQ0EsNkJBQXFCLFdBQXJCLCtEQUEwRixLQUExRjtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IFFTIGZyb20gJ3F1ZXJ5c3RyaW5nJztcbmltcG9ydCBkZWJ1Z0xpYiBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGRlYnVnID0gZGVidWdMaWIoJ3BheXBhbC1leHByZXNzLWNoZWNrb3V0Jyk7XG5cbi8vIGZsb3cgdHlwZSBmb3IgcGF5cGFsIGV4cHJlc3MgY2hlY2tvdXRcbmV4cG9ydCB0eXBlIFBheXBhbEVDQ29uZmlnVHlwZSA9IHtcbiAgaXNTYW5kYm94OiBib29sLFxuICBDVVJSRU5DWUNPREU6IHN0cmluZyxcbiAgVVNFUjogc3RyaW5nLFxuICBQV0Q6IHN0cmluZyxcbiAgU0lHTkFUVVJFOiBzdHJpbmcsXG4gIHJldHVyblVybDogc3RyaW5nLFxuICBjYW5jZWxVcmw6IHN0cmluZyxcbiAgVkVSU0lPTjogc3RyaW5nXG59O1xuXG5leHBvcnQgdHlwZSBQYXlwYWxFQ01ldGhvZFR5cGUgPSAnU2V0RXhwcmVzc0NoZWNrb3V0JyB8XG4gICdHZXRFeHByZXNzQ2hlY2tvdXREZXRhaWxzJyB8XG4gICdEb0V4cHJlc3NDaGVja291dFBheW1lbnQnO1xuXG5leHBvcnQgdHlwZSBQYXlwYWxFQ1JlcXVlc3RQYXJhbVR5cGUgPSB7XG4gIFVTRVI6IHN0cmluZyxcbiAgUFdEOiBzdHJpbmcsXG4gIFNJR05BVFVSRTogc3RyaW5nLFxuICBNRVRIT0Q6IHN0cmluZyxcbiAgVkVSU0lPTjogc3RyaW5nXG59O1xuXG5leHBvcnQgdHlwZSBQYXlwYWxFQ1Jlc3VsdFR5cGUgPSB7XG4gIGVycm9yQ29kZTogP3N0cmluZyxcbiAgc3RhdHVzQ29kZTogbnVtYmVyLFxuICByZXNwb25zZUJvZHk6IHN0cmluZyxcbiAgcmVzdWx0OiA/T2JqZWN0XG59O1xuXG4vLyBkZWZhdWx0IGNvbmZpZ1xuY29uc3QgZGVmYXVsdENvbmZpZzogUGF5cGFsRUNDb25maWdUeXBlID0ge1xuICBpc1NhbmRib3g6IHRydWUsXG4gIENVUlJFTkNZQ09ERTogJ1VTRCcsXG4gIFVTRVI6ICcnLFxuICBQV0Q6ICcnLFxuICBTSUdOQVRVUkU6ICcnLFxuICByZXR1cm5Vcmw6ICcnLFxuICBjYW5jZWxVcmw6ICcnLFxuICBWRVJTSU9OOiAnODYnXG59O1xuXG4vLyBmbG93IHR5cGVzIGZvciByZXF1ZXN0XG50eXBlIFJlcXVlc3RFcnJvclR5cGUgPSB7XG4gIGNvZGU6IHN0cmluZ1xufTtcblxudHlwZSBSZXF1ZXN0SHR0cFJlc3BvbnNlVHlwZSA9IHtcbiAgc3RhdHVzQ29kZTogbnVtYmVyXG59O1xuXG4vKipcbiAqIEBjbGFzcyBQYXlwYWxFeHByZXNzQ2hlY2tvdXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAvKipcbiAgICogQHByb3BlcnR5IGNvbmZpZ1xuICAgKi9cbiAgY29uZmlnOiBQYXlwYWxFQ0NvbmZpZ1R5cGVcblxuICAvKipcbiAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0geyBPYmplY3QgfSBjb25maWcgLSBpbml0aWFsIGNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBPYmplY3QpIHtcbiAgICB0aGlzLnNldENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldENvbmZpZ1xuICAgKiBAcGFyYW0geyBPYmplY3QgfSBjb25maWcgLSBuZXcgY29uZmlnIHRvIHNldFxuICAgKi9cbiAgc2V0Q29uZmlnKGNvbmZpZzogT2JqZWN0KSB7XG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZywgY29uZmlnKTtcbiAgICBkZWJ1ZygnJXMgbW9kZSBzZXQnLCB0aGlzLmlzU2FuZGJveCA/ICdTYW5kYm94JyA6ICdQcm9kdWN0aW9uJyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0QVBJRW5kcG9pbnRcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge3N0cmluZ30gcGF5cGFsIEFQSSBlbmRwb2ludCBmcm9tIGNvbmZpZ1xuICAgKi9cbiAgX2dldEFQSUVuZHBvaW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmlzU2FuZGJveCA/ICdodHRwczovL2FwaS0zdC5zYW5kYm94LnBheXBhbC5jb20vbnZwJyA6ICdodHRwczovL2FwaS0zdC5wYXlwYWwuY29tL252cCc7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0UmVxdWVzdFBhcmFtc1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1BheXBhbEVDTWV0aG9kVHlwZX0gbWV0aG9kIC0gYXBpIG1ldGhvZFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0ga2V5LHZhbHVlIGJhc2VkIHBhcmFtZXRlciBsaXN0IGZvciBhcGlcbiAgICogQHJldHVybnMge1BheXBhbEVDUmVxdWVzdFBhcmFtVHlwZX0gcGFyYW1ldGVyIG9iamVjdCBmb3IgcGF5cGFsIGV4cHJlc3MgY2hlY2tvdXQgY2FsbFxuICAgKi9cbiAgX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kOiBQYXlwYWxFQ01ldGhvZFR5cGUsIHBhcmFtczogT2JqZWN0KTogUGF5cGFsRUNSZXF1ZXN0UGFyYW1UeXBlIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucGFyYW1zLFxuICAgICAgVVNFUjogdGhpcy5jb25maWcuVVNFUixcbiAgICAgIFBXRDogdGhpcy5jb25maWcuUFdELFxuICAgICAgVkVSU0lPTjogdGhpcy5jb25maWcuVkVSU0lPTixcbiAgICAgIFNJR05BVFVSRTogdGhpcy5jb25maWcuU0lHTkFUVVJFLFxuICAgICAgTUVUSE9EOiBtZXRob2RcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgY2FsbFxuICAgKiBAcGFyYW0ge1BheXBhbEVDTWV0aG9kVHlwZX0gbWV0aG9kIC0gYXBpIG1ldGhvZFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0ga2V5LHZhbHVlIGJhc2VkIHBhcmFtZXRlciBsaXN0IGZvciBhcGlcbiAgICogQHJldHVybnMge1Byb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPn0gcHJvbWlzZSBvZiBhcGkgY2FsbCByZXN1bHRcbiAgICovXG4gIGNhbGwobWV0aG9kOiBQYXlwYWxFQ01ldGhvZFR5cGUsIHBhcmFtczogT2JqZWN0KTogUHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCB1cmk6IHN0cmluZyA9IHRoaXMuX2dldEFQSUVuZHBvaW50KCk7XG4gICAgY29uc3QgZm9ybTogUGF5cGFsRUNSZXF1ZXN0UGFyYW1UeXBlID0gdGhpcy5fZ2V0UmVxdWVzdFBhcmFtcyhtZXRob2QsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IEZ1bmN0aW9uLCByZWplY3Q6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICBkZWJ1ZyhgUE9TVCAke3VyaX1gKTtcbiAgICAgIGRlYnVnKGBGb3JtICR7SlNPTi5zdHJpbmdpZnkoZm9ybSwgbnVsbCwgMil9YCk7XG5cbiAgICAgIHJlcXVlc3QucG9zdCh7XG4gICAgICAgIHVyaSxcbiAgICAgICAgZm9ybVxuICAgICAgfSwgKGVycjogP1JlcXVlc3RFcnJvclR5cGUsIGh0dHBSZXNwOiBSZXF1ZXN0SHR0cFJlc3BvbnNlVHlwZSwgcmVzcG9uc2VCb2R5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBQYXlwYWxFQ1Jlc3VsdFR5cGUgPSB7XG4gICAgICAgICAgZXJyb3JDb2RlOiBudWxsLFxuICAgICAgICAgIHJlc3BvbnNlQm9keSxcbiAgICAgICAgICBzdGF0dXNDb2RlOiBodHRwUmVzcC5zdGF0dXNDb2RlLFxuICAgICAgICAgIHJlc3VsdDogUVMucGFyc2UocmVzcG9uc2VCb2R5KVxuICAgICAgICB9O1xuXG4gICAgICAgIGRlYnVnKGBSZXNwb25zZSBodHRwIHN0YXR1cyAke3Jlc3VsdC5zdGF0dXNDb2RlfWApO1xuICAgICAgICBkZWJ1ZyhgUmVzcG9uc2UgZXJyb3IgY29kZSAke3Jlc3VsdC5lcnJvckNvZGV9YCk7XG4gICAgICAgIGRlYnVnKGBSZXNwb25zZSByZXN1bHQgJHtKU09OLnN0cmluZ2lmeShyZXN1bHQucmVzdWx0LCBudWxsLCAyKX1gKTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IGVyci5jb2RlO1xuICAgICAgICAgIHJlamVjdChyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBnZXRVcmxGcm9tVG9rZW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gYXV0aCB0b2tlbiBjcmVhdGVkIGZyb20gb3RoZXIgZnVuY3NcbiAgICogQHJldHVybnMge3N0cmluZ30gRnVsbCBwYXlwYWwgdXJsIHRvIHJlZGlyZWN0IHVzZXIgZm9yIGFjdGlvbnNcbiAgICovXG4gIGdldFVybEZyb21Ub2tlbih0b2tlbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzYW5kYm94VGV4dDogc3RyaW5nID0gdGhpcy5jb25maWcuc2FuZGJveCA/ICcuc2FuZGJveCcgOiAnJztcbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3JHtzYW5kYm94VGV4dH0ucGF5cGFsLmNvbS9jZ2ktYmluL3dlYnNjcj9jbWQ9X2V4cHJlc3MtY2hlY2tvdXQmdG9rZW49JHt0b2tlbn1gO1xuICB9XG59XG4iXX0=