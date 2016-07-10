var expressCheckout = require('./dist');
var parallelPayment = require('./dist/parallel-payment');
var referencePayment = require('./dist/reference-payment');

module.exports = expressCheckout;
module.exports.ReferencePayment = referencePayment.default;
module.exports.ParallelPayment = parallelPayment.default;
