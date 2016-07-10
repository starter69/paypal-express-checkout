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
 * @class PaypalExpressCheckout/ParallelPayment
 */

var _class = function (_PaypalExpressCheckou) {
  _inherits(_class, _PaypalExpressCheckou);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'getExpressCheckoutDetails',

    /**
     * @method getExpressCheckoutDetails
     * @param {string} token - auth token
     * @returns {Promise<PaypalECResultType>} promise of api call result
     */
    value: function getExpressCheckoutDetails(token) {
      var params = {
        TOKEN: token
      };
      return this.call('GetExpressCheckoutDetails', params);
    }
  }]);

  return _class;
}(_index2.default);

exports.default = _class;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcmFsbGVsLXBheW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhDQVk0QixLLEVBQTRDO0FBQ3BFLFVBQU0sU0FBaUI7QUFDckIsZUFBTztBQURjLE9BQXZCO0FBR0EsYUFBTyxLQUFLLElBQUwsQ0FBVSwyQkFBVixFQUF1QyxNQUF2QyxDQUFQO0FBQ0QiLCJmaWxlIjoicGFyYWxsZWwtcGF5bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUGF5cGFsRXhwcmVzc0NoZWNrb3V0IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHR5cGUgeyBQYXlwYWxFQ1Jlc3VsdFR5cGUgfSBmcm9tICcuL2luZGV4JztcblxuLyoqXG4gKiBAY2xhc3MgUGF5cGFsRXhwcmVzc0NoZWNrb3V0L1BhcmFsbGVsUGF5bWVudFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFBheXBhbEV4cHJlc3NDaGVja291dCB7XG4gIC8qKlxuICAgKiBAbWV0aG9kIGdldEV4cHJlc3NDaGVja291dERldGFpbHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gYXV0aCB0b2tlblxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+fSBwcm9taXNlIG9mIGFwaSBjYWxsIHJlc3VsdFxuICAgKi9cbiAgZ2V0RXhwcmVzc0NoZWNrb3V0RGV0YWlscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxQYXlwYWxFQ1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCBwYXJhbXM6IE9iamVjdCA9IHtcbiAgICAgIFRPS0VOOiB0b2tlblxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuY2FsbCgnR2V0RXhwcmVzc0NoZWNrb3V0RGV0YWlscycsIHBhcmFtcyk7XG4gIH1cbn1cbiJdfQ==