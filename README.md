# ember-stripe-service
[![Build Status](https://travis-ci.org/code-corps/ember-stripe-service.svg?branch=master)](https://travis-ci.org/code-corps/ember-stripe-service) [![npm version](https://badge.fury.io/js/ember-stripe-service.svg)](https://badge.fury.io/js/ember-stripe-service) [![Ember Observer Score](https://emberobserver.com/badges/ember-stripe-service.svg)](https://emberobserver.com/addons/ember-stripe-service) [![Inline docs](http://inch-ci.org/github/code-corps/ember-stripe-service.svg?branch=master&style=shields)](http://inch-ci.org/github/code-corps/ember-stripe-service) [![Discord](https://img.shields.io/discord/480462759797063690.svg?logo=discord)](https://discord.gg/zT3asNS)

`ember-stripe-service` is an easy way to add Stripe.js library to your ember-cli project without having to deal with manually setting the script tag.

If you have any questions, come :wave: hello in the ![Official Ember Discord](https://discord.gg/zT3asNS)

## Features
- sets stripe.js script in index.html (test, app)
- initializes stripe with publishable key
- injects service in controllers which provides promisified method for `Stripe.card.createToken`
- provides debugging logs for easy troubleshooting
- client side validations for card number, expiration dates, card type and CVC
- lazy load stripe.js

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
  publishableKey: 'pk_thisIsATestKey',
  debug: false, // turn on debugging
  lazyLoad: false, // lazy load stripe
  mock: false // mock out stripe.js, good for offline testing
};
````

## Lazy loading

If `lazyLoad` is set to turn Stripe.js will not be loaded until you call the `load()` function on the service. It's best to call this function in a route's beforeModel hook.

```js
// subscription page route

import Ember from 'ember';

export default Ember.Route.extend({
  stripe: Ember.inject.service('stripe'),

  beforeModel() {
    return this.get('stripe').load();
  }
});
```

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

## Creating Stripe Tokens for PII Data

The interface is similar yet again for PII data tokens:

````javascript

    // obtain access to the injected service
    var stripe = this.get('stripe');

    var piiData = {
      personalIdNumber: '123456789'
    }

    return stripe.piiData.createToken(piiData).then(function(response) {
      // you get access to your newly created token here
      customer.set('personalIdNumberStripeToken', response.id);
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
  stripe: {
    debug: true
  }
  // more config ...
}
````

## Client-side Validations
Stripe has a few client-side validation helpers. See more information
[here](https://stripe.com/docs/stripe.js?#card-validation-helpers)

* `validateCardNumber` - Checks that the number is formatted correctly and passes the Luhn check.
* `validateExpiry` - Checks whether or not the expiration date represents an actual month in the future.
* `validateCVC` - Checks whether or not the supplied number could be a valid verification code.
* `cardType` - Returns the type of the card as a string. The possible types are "Visa", "MasterCard", "American
  Express", "Discover", "Diners Club", and "JCB". If a card isn't recognized, the return value is "Unknown".

## Running Tests

* `ember test`
* `ember test --server`

In order to run integration tests which use real Stripe tokens, the environment variable `STRIPE_PUBLISHABLE_KEY` must be set to use a real Stripe Publishable Key (either test or live).

* `export STRIPE_PUBLISHABLE_KEY="pk_thisIsAKey" ember test`

This repo comes with a `envrc.example` file, which uses the [direnv](http://direnv.net/) tool to manage directory-local environment variables. To use direnv to set the `STRIPE_PUBLISHABLE_KEY` environment variable, install and enable `direnv`, make a copy of `envrc.example` and name it `.envrc`, and add your key to that file. Note that `.envrc` is ignored by git, and thus will not ever be checked into this repository.

You can also use any other tool you'd like to manage setting your environment variable.

You can get the test key used to run this repo's integration tests by looking at the output from the latest Travis build.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Upcoming Features
- We're thinking of giving access other methods of Stripe, but we're not sure so if you find one useful please make an issue
- Provide an option to inject mocked Stripe library inspired by ember-cli-custom-form but with deeper mocking and set by config flag not environment so integration tests can still be run with real service if wanted
- PRs welcome and encouraged, and if you're not sure how to implement something we could try to work together
