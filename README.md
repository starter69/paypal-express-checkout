# paypal-express-checkout
Nodejs library for paypal express checkout

Note: Full documentation is not ready yet. Please take a look at code. It will make sense because it is with flow types.

## Building
``` sh
gulp build
```

## Usage

### Basic usage
All functions basically uses `call` function to send API request.

For reference please refer to https://developer.paypal.com/docs/classic/express-checkout/

```js
import Paypal from 'paypal-express-checkout-es6';

const config = {
  USER,
  PWD,
  SIGNATURE,
  isSandbox
};

const paypal = new Paypal(config);

paypal.call(method, params);

```

### Sample (one time checkout)
```js
paypal.call('SetExpressCheckout', {
  PAYMENTREQUEST_0_PAYMENTACTION: 'SALE', // type of payment
  PAYMENTREQUEST_0_AMT: 19.95, // amount of transaction
  PAYMENTREQUEST_0_CURRENCYCODE: 'USD', // currency of transaction
  RETURNURL: 'http://www.example.com/success.html', // URL of your payment confirmation page
  CANCELURL: 'http://www.example.com/cancel.html'// URL redirect if customer cancels payment
});
```

### Parallel Payment
These functions are available for parallel payment.
* setExpressCheckout
* doExpressCheckoutPayment
* getExpressCheckoutDetails

### Reference Transactions
* getReferenceAuthToken
* createBillingAgreement
* doReferenceTransaction
