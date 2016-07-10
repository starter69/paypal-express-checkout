var expressCheckout = require('./dist');
var parallelPayment = require('./dist/parallel-payment');
var referencePayment = require('./dist/reference-payment');

module.exports = {
  default: expressCheckout,
  ReferencePayment: referencePayment,
  ParallelPayment: parallelPayment
};
