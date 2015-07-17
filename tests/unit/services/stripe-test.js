/* global Stripe */

import Ember from 'ember';
import sinon from 'sinon';
import { moduleFor, test } from 'ember-qunit';
import QUnit from 'qunit';

moduleFor('service:stripe', 'StripeService', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

var cc = {
  number: 4242424242424242,
  exp_year: 2018,
  exp_month: 10,
  cvc: 123,
  address_zip: 12345
};

test('card.createToken sets the token and returns a promise', function(assert) {
  var service = this.subject();
  var response = {
    id: 'the_token'
  };

  var createToken = sinon.stub(Stripe.card, 'createToken', function(card, cb) {
    assert.equal(card, cc, 'called with sample creditcard');
    cb(200, response);
  });

  return service.card.createToken(cc)
    .then(function(res) {
      assert.equal(res.id, 'the_token');
      createToken.restore();
    });
});

test('card.createToken rejects the promise if Stripe errors', function(assert) {
  var service = this.subject();
  var response = {
    error : {
      code: "invalid_number",
      message: "The 'exp_month' parameter should be an integer (instead, is Month).",
      param: "exp_month",
      type: "card_error"
    }
  };

  var createToken = sinon.stub(Stripe.card, 'createToken', function(card, cb) {
    cb(402, response);
  });

  return service.card.createToken(cc)
  .then(undefined, function(res) {
    assert.equal(res, response, 'error passed');
    createToken.restore();
  });
});

// Bank accounts

var ba = {
  country: 'US',
  routingNumber: '123124112',
  accountNumber: '125677688',
};

test('bankAccount.createToken sets the token and returns a promise', function(assert) {
  var service = this.subject();
  var response = {
    id: 'the_token'
  };

  var createBankAccountToken = sinon.stub(
    Stripe.bankAccount,
    'createToken',
    function(bankAccount, cb) {
      assert.equal(bankAccount, ba, 'called with sample bankAccount');
      cb(200, response);
    }
  );

  return service.bankAccount.createToken(ba)
    .then(function(res) {
      assert.equal(res.id, 'the_token');
      createBankAccountToken.restore();
    });
});

test('bankAccount.createToken rejects the promise if Stripe errors', function(assert) {
  var service = this.subject();
  var response = {
    error : {
      code: "invalid_number",
      message: "The 'exp_month' parameter should be an integer (instead, is Month).",
      param: "exp_month",
      type: "bank_account_errror"
    }
  };

  var createBankAccountToken = sinon.stub(
    Stripe.bankAccount,
    'createToken',
    function(bankAccount, cb) {
      cb(402, response);
    }
  );

  return service.bankAccount.createToken(ba)
  .then(undefined, function(res) {
    assert.equal(res, response, 'error passed');
    createBankAccountToken.restore();
  });
});


// LOG_STRIPE_SERVICE is set to true in dummy app
test('it logs when LOG_STRIPE_SERVICE is set in env config', function(assert) {
  var service = this.subject();
  var info = sinon.stub(Ember.Logger, 'info');

  var createToken = sinon.stub(Stripe.card, 'createToken', function(card, cb) {
    var response = {
      id: 'my id'
    };
    cb(200, response);
  });

  return service.card.createToken(cc)
  .then(function() {
    assert.ok(info.called);
    createToken.restore();
    info.restore();
  });
});

test('it card.validateCardNumber return true if credit card number is valid', function (assert) {
  var service = this.subject();
  var number = '4111111111111111';

  var isValid = service.card.validateCardNumber(number);

  assert.ok(isValid, 'valid credit card number');
});

test('it card.validateCardNumber return false if credit card number is invalid', function (assert) {
  var service = this.subject();
  var number = '4242111111111111';

  var isValid = service.card.validateCardNumber(number);
  assert.ok(!isValid, 'invalid credit card number');

  number = '12345678';
  isValid = service.card.validateCardNumber(number);
  assert.ok(!isValid, 'invalid credit card number');

  number = 'mistake';
  isValid = service.card.validateCardNumber(number);
  assert.ok(!isValid, 'invalid credit card number');
});

test('it card.cardType returns the type of the card as a string', function (assert) {
  var service = this.subject();

  var type = service.card.cardType('4242-4242-4242-4242');
  assert.equal(type, 'Visa');

  type = service.card.cardType('378282246310005');
  assert.equal(type, 'American Express');

  type = service.card.cardType('1234');
  assert.equal(type, 'Unknown');
});

test('it card.validateExpiry returns true if represents an actual month in the future', function (assert) {
  var service = this.subject();

  var isValid = service.card.validateExpiry('02', '2020');
  assert.ok(isValid, 'expiry date is valid');
  isValid = service.card.validateExpiry(2, 2020);
  assert.ok(isValid, 'expiry date is valid');
});

test('it card.validateExpiry returns false if not represents an actual month in the future', function (assert) {
  var service = this.subject();
  var isValid = service.card.validateExpiry('02', '15');

  assert.ok(!isValid, 'expiry date is invalid');
  isValid = service.card.validateExpiry(2, 2015);
  assert.ok(!isValid, 'expiry date is invalid');
});

/**
 * @todo figure out how to change env variables at runtime
 */
QUnit.skip('it logs if LOG_STRIPE_SERVICE is false');
QUnit.skip('it throws an error if config.stripe.publishableKey is not set');
