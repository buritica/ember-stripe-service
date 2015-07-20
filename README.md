
# ember-stripe-service
[![Build Status](https://travis-ci.org/ride/ember-stripe-service.svg?branch=master)](https://travis-ci.org/ride/ember-stripe-service)

## Description
`ember-stripe-service` is an easy way to add Stripe.js library to your ember-cli project without having to deal with manually setting the script tag

## Features
- sets stripe.js script in index.html (test, app)
- initializes stripe with publishable key
- injects service in controllers which provides promisified method for `Stripe.card.createToken`
- provides debugging logs for easy troubleshooting

## Installation

* `npm install --save ember-stripe-service`
* `ember server`
* set `stripe.publishableKey` in `config/environment.js`
* Visit your app at http://localhost:4200, you should now see the stripe.js script has been included
* `Stripe` global is now available in your app

## Configuration

### Stripe Publishable Key
In order to use Stripe you must set your [publishable key](https://dashboard.stripe.com/account/apikeys) in `config/environment.js`.

````javascript
ENV.stripe = {
  publishableKey: 'pk_thisIsATestKey'
};
````

### Lazy Loading of `stripe.js`

By default, `ember-stripe-service` loads the `stripe.js` library during app initialization. If you want to load the script lazily in order to improve boot
performance, set `lazyLoad: true`:
```javascript
ENV.stripe = {
  publishableKey: 'pk_thisIsATestKey',
  lazyLoad: true
};
```

`ember-stripe-service` will fetch `stripe.js` the first time it is needed.

You can ensure it's ready before then by calling `stripeService.getScript()`.
For example,

```javascript
// app/routes/payment.js

stripe: Ember.inject.service(),

afterModel: function() {
  return this.get('stripe').getScript();
}
```

It is safe to call `getScript` multiple times. If `Stripe` is already loaded,
it will return a Promise that resolves immediately.

## Creating Stripe Tokens for Cards

`ember-stripe-service` provides a promisified version of
`Stripe.card.createToken` which makes it easier to interact with its returns
within your Ember controllers.

The method makes `createToken` operate under Ember run's loop making it easier
to create integration tests that operate with Stripe's test mode.

To use it inside of a controller action or method you would:

````javascript

export default Ember.Controller.extend({
  stripe: Ember.inject.service(),
  myCreditCardProcessingMethod: function() {

    var customer = this.get('customer');

    // obtain access to the injected service
    var stripe = this.get('stripe');

    // if for example you had the cc set in your controller
    var card = this.get('creditCard');

    return stripe.card.createToken(card).then(function(response) {
      // you get access to your newly created token here
      customer.set('stripeToken', response.id);
      return customer.save();
    })
    .then(function() {
      // do more stuff here
    })
    .catch(function(response) {
      // if there was an error retrieving the token you could get it here

      if (response.error.type === 'card_error') {
        // show the error in the form or something
      }
    });
  }
})
````
## Creating Stripe Tokens for Bank Accounts

The interface is similar for bank account tokens:

````javascript

    // obtain access to the injected service
    var stripe = this.get('stripe');

    // if for example you had the cc set in your controller
    var bankAccount = {
      country: 'US',
      routingNumber: '1235678',
      accountNumber: '23875292349'
    }

    return stripe.bankAccount.createToken(bankAccount).then(function(response) {
      // you get access to your newly created token here
      customer.set('bankAccountStripeToken', response.id);
      return customer.save();
    })
    .catch(response) {
      // if there was an error retrieving the token you could get it here

      if (response.error.type === 'invalid_request_error') {
        // show an error in the form
      }
    }
  }
})
````

## Debugging
By setting `LOG_STRIPE_SERVICE` to true in your application configuration you can enable some debugging messages from the service

````javascript
var ENV = {
  // some vars...
  LOG_STRIPE_SERVICE: true,
  // more config ...
}
````

## Running Tests

* `ember test`
* `ember test --server`

In order to run integration tests which use real Stripe tokens, the environment variable `STRIPE_PUBLISHABLE_KEY` must be set to use a real Stripe Publishable Key (either test or live).

* `export STRIPE_PUBLISHABLE_KEY="pk_thisIsAKey" ember test`


For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Upcoming Features
- We're thinking of giving access other methods of Stripe, but we're not sure so if you find one useful please make an issue
- Provide an option to inject mocked Stripe library inspired by ember-cli-custom-form but with deeper mocking and set by config flag not environment so integration tests can still be run with real service if wanted
- PRs welcome and encouraged, and if you're not sure how to implement something we could try to work together
