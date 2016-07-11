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
      debug('%s mode set', this.config.isSandbox ? 'Sandbox' : 'Production');
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
      return _extends({}, params, {
        USER: this.config.USER,
        PWD: this.config.PWD,
        VERSION: this.config.VERSION,
        SIGNATURE: this.config.SIGNATURE,
        returnUrl: this.config.returnUrl,
        cancelUrl: this.config.cancelUrl,
        METHOD: method
      });
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
      var sandboxText = this.config.isSandbox ? '.sandbox' : '';
      return 'https://www' + sandboxText + '.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + token;
    }
  }]);

  return _class;
}();

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,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KiBAZmxvdyAqL1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgUVMgZnJvbSAncXVlcnlzdHJpbmcnO1xuaW1wb3J0IGRlYnVnTGliIGZyb20gJ2RlYnVnJztcblxuY29uc3QgZGVidWcgPSBkZWJ1Z0xpYigncGF5cGFsLWV4cHJlc3MtY2hlY2tvdXQnKTtcblxuLy8gZmxvdyB0eXBlIGZvciBwYXlwYWwgZXhwcmVzcyBjaGVja291dFxuZXhwb3J0IHR5cGUgUGF5cGFsRUNDb25maWdUeXBlID0ge1xuICBpc1NhbmRib3g6IGJvb2wsXG4gIENVUlJFTkNZQ09ERTogc3RyaW5nLFxuICBVU0VSOiBzdHJpbmcsXG4gIFBXRDogc3RyaW5nLFxuICBTSUdOQVRVUkU6IHN0cmluZyxcbiAgcmV0dXJuVXJsOiBzdHJpbmcsXG4gIGNhbmNlbFVybDogc3RyaW5nLFxuICBWRVJTSU9OOiBzdHJpbmdcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSA9IHtcbiAgVVNFUjogc3RyaW5nLFxuICBQV0Q6IHN0cmluZyxcbiAgU0lHTkFUVVJFOiBzdHJpbmcsXG4gIE1FVEhPRDogc3RyaW5nLFxuICBWRVJTSU9OOiBzdHJpbmdcbn07XG5cbmV4cG9ydCB0eXBlIFBheXBhbEVDUmVzdWx0VHlwZSA9IHtcbiAgZXJyb3JDb2RlOiA/c3RyaW5nLFxuICBzdGF0dXNDb2RlOiBudW1iZXIsXG4gIHJlc3BvbnNlQm9keTogc3RyaW5nLFxuICByZXN1bHQ6ID9PYmplY3Rcbn07XG5cbi8vIGRlZmF1bHQgY29uZmlnXG5jb25zdCBkZWZhdWx0Q29uZmlnOiBQYXlwYWxFQ0NvbmZpZ1R5cGUgPSB7XG4gIGlzU2FuZGJveDogdHJ1ZSxcbiAgQ1VSUkVOQ1lDT0RFOiAnVVNEJyxcbiAgVVNFUjogJycsXG4gIFBXRDogJycsXG4gIFNJR05BVFVSRTogJycsXG4gIHJldHVyblVybDogJycsXG4gIGNhbmNlbFVybDogJycsXG4gIFZFUlNJT046ICc4Nidcbn07XG5cbi8vIGZsb3cgdHlwZXMgZm9yIHJlcXVlc3RcbnR5cGUgUmVxdWVzdEVycm9yVHlwZSA9IHtcbiAgY29kZTogc3RyaW5nXG59O1xuXG50eXBlIFJlcXVlc3RIdHRwUmVzcG9uc2VUeXBlID0ge1xuICBzdGF0dXNDb2RlOiBudW1iZXJcbn07XG5cbi8qKlxuICogQGNsYXNzIFBheXBhbEV4cHJlc3NDaGVja291dFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIC8qKlxuICAgKiBAcHJvcGVydHkgY29uZmlnXG4gICAqL1xuICBjb25maWc6IFBheXBhbEVDQ29uZmlnVHlwZVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIGluaXRpYWwgY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdCkge1xuICAgIHRoaXMuc2V0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRDb25maWcsIGNvbmZpZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0Q29uZmlnXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmZpZyAtIG5ldyBjb25maWcgdG8gc2V0XG4gICAqL1xuICBzZXRDb25maWcoY29uZmlnOiBPYmplY3QpIHtcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLCBjb25maWcpO1xuICAgIGRlYnVnKCclcyBtb2RlIHNldCcsIHRoaXMuY29uZmlnLmlzU2FuZGJveCA/ICdTYW5kYm94JyA6ICdQcm9kdWN0aW9uJyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0QVBJRW5kcG9pbnRcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge3N0cmluZ30gcGF5cGFsIEFQSSBlbmRwb2ludCBmcm9tIGNvbmZpZ1xuICAgKi9cbiAgX2dldEFQSUVuZHBvaW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmlzU2FuZGJveCA/ICdodHRwczovL2FwaS0zdC5zYW5kYm94LnBheXBhbC5jb20vbnZwJyA6ICdodHRwczovL2FwaS0zdC5wYXlwYWwuY29tL252cCc7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0UmVxdWVzdFBhcmFtc1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gYXBpIG1ldGhvZFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0ga2V5LHZhbHVlIGJhc2VkIHBhcmFtZXRlciBsaXN0IGZvciBhcGlcbiAgICogQHJldHVybnMge1BheXBhbEVDUmVxdWVzdFBhcmFtVHlwZX0gcGFyYW1ldGVyIG9iamVjdCBmb3IgcGF5cGFsIGV4cHJlc3MgY2hlY2tvdXQgY2FsbFxuICAgKi9cbiAgX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kOiBzdHJpbmcsIHBhcmFtczogT2JqZWN0KTogUGF5cGFsRUNSZXF1ZXN0UGFyYW1UeXBlIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucGFyYW1zLFxuICAgICAgVVNFUjogdGhpcy5jb25maWcuVVNFUixcbiAgICAgIFBXRDogdGhpcy5jb25maWcuUFdELFxuICAgICAgVkVSU0lPTjogdGhpcy5jb25maWcuVkVSU0lPTixcbiAgICAgIFNJR05BVFVSRTogdGhpcy5jb25maWcuU0lHTkFUVVJFLFxuICAgICAgcmV0dXJuVXJsOiB0aGlzLmNvbmZpZy5yZXR1cm5VcmwsXG4gICAgICBjYW5jZWxVcmw6IHRoaXMuY29uZmlnLmNhbmNlbFVybCxcbiAgICAgIE1FVEhPRDogbWV0aG9kXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNhbGxcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIGFwaSBtZXRob2RcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIGtleSx2YWx1ZSBiYXNlZCBwYXJhbWV0ZXIgbGlzdCBmb3IgYXBpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBheXBhbEVDUmVzdWx0VHlwZT59IHByb21pc2Ugb2YgYXBpIGNhbGwgcmVzdWx0XG4gICAqL1xuICBjYWxsKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IE9iamVjdCk6IFByb21pc2U8UGF5cGFsRUNSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgdXJpOiBzdHJpbmcgPSB0aGlzLl9nZXRBUElFbmRwb2ludCgpO1xuICAgIGNvbnN0IGZvcm06IFBheXBhbEVDUmVxdWVzdFBhcmFtVHlwZSA9IHRoaXMuX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBGdW5jdGlvbiwgcmVqZWN0OiBGdW5jdGlvbikgPT4ge1xuICAgICAgZGVidWcoYFBPU1QgJHt1cml9YCk7XG4gICAgICBkZWJ1ZyhgRm9ybSAke0pTT04uc3RyaW5naWZ5KGZvcm0sIG51bGwsIDIpfWApO1xuXG4gICAgICByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICB1cmksXG4gICAgICAgIGZvcm1cbiAgICAgIH0sIChlcnI6ID9SZXF1ZXN0RXJyb3JUeXBlLCBodHRwUmVzcDogUmVxdWVzdEh0dHBSZXNwb25zZVR5cGUsIHJlc3BvbnNlQm9keTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGF5cGFsRUNSZXN1bHRUeXBlID0ge1xuICAgICAgICAgIGVycm9yQ29kZTogbnVsbCxcbiAgICAgICAgICByZXNwb25zZUJvZHksXG4gICAgICAgICAgc3RhdHVzQ29kZTogaHR0cFJlc3Auc3RhdHVzQ29kZSxcbiAgICAgICAgICByZXN1bHQ6IFFTLnBhcnNlKHJlc3BvbnNlQm9keSlcbiAgICAgICAgfTtcblxuICAgICAgICBkZWJ1ZyhgUmVzcG9uc2UgaHR0cCBzdGF0dXMgJHtyZXN1bHQuc3RhdHVzQ29kZX1gKTtcbiAgICAgICAgZGVidWcoYFJlc3BvbnNlIGVycm9yIGNvZGUgJHtyZXN1bHQuZXJyb3JDb2RlfWApO1xuICAgICAgICBkZWJ1ZyhgUmVzcG9uc2UgcmVzdWx0ICR7SlNPTi5zdHJpbmdpZnkocmVzdWx0LnJlc3VsdCwgbnVsbCwgMil9YCk7XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnIuY29kZTtcbiAgICAgICAgICByZWplY3QocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZ2V0VXJsRnJvbVRva2VuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIGF1dGggdG9rZW4gY3JlYXRlZCBmcm9tIG90aGVyIGZ1bmNzXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IEZ1bGwgcGF5cGFsIHVybCB0byByZWRpcmVjdCB1c2VyIGZvciBhY3Rpb25zXG4gICAqL1xuICBnZXRVcmxGcm9tVG9rZW4odG9rZW46IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2FuZGJveFRleHQ6IHN0cmluZyA9IHRoaXMuY29uZmlnLmlzU2FuZGJveCA/ICcuc2FuZGJveCcgOiAnJztcbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3JHtzYW5kYm94VGV4dH0ucGF5cGFsLmNvbS9jZ2ktYmluL3dlYnNjcj9jbWQ9X2V4cHJlc3MtY2hlY2tvdXQmdG9rZW49JHt0b2tlbn1gO1xuICB9XG59XG4iXX0=