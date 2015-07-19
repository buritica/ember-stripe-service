/* global Stripe */
import env from '../config/environment';
import Ember from 'ember';

function debug() {
  var debuggingEnabled = (typeof env.LOG_STRIPE_SERVICE !== 'undefined');
  console.log('debuggingEnabled', debuggingEnabled);

  if (!debuggingEnabled) {
    return false;
  }

  var args = Array.prototype.slice.call(arguments);
  args[0] = `StripeService: ${args[0]}`;
  Ember.Logger.info.apply(null, args);
}

function createCardToken (card) {
  debug('card.createToken:', card);

  // manually start Ember loop
  Ember.run.begin();

  return new Ember.RSVP.Promise(function (resolve, reject) {
    Stripe.card.createToken(card, function (status, response) {

      debug('card.createToken handler - status %s, response:', status, response);

      if (response.error) {
        return Ember.run(null, reject, response);
      }

      Ember.run(null, resolve, response);

    });
  });
}

function createCardTokenDeprecated(card) {
  Ember.deprecate(
    '`EmberStripeService.createToken` has been deprecated in ' +
    'favor of `EmberStripeService.card.createToken` to match ' +
    'the Stripe API.'
  );
  return createCardToken(card);
}

function createBankAccountToken(bankAccount) {
  debug('bankAccount.createToken:', bankAccount);

  // manually start Ember loop
  Ember.run.begin();

  return new Ember.RSVP.Promise(function (resolve, reject) {
    Stripe.bankAccount.createToken(bankAccount, function (status, response) {

      debug('bankAccount.createToken handler - status %s, response:', status, response);

      if (response.error) {
        return Ember.run(null, reject, response);
      }

      Ember.run(null, resolve, response);
    });
  });
}

/**
 * Expose module
 */
export default Ember.Service.extend({
  card: {
    createToken: createCardToken,
    cardType: Stripe.card.cardType,
    validateCardNumber: Stripe.card.validateCardNumber,
    validateCVC: Stripe.card.validateCVC,
    validateExpiry: Stripe.card.validateExpiry
  },
  bankAccount: {
    createToken: createBankAccountToken,
    validateRoutingNumber: Stripe.bankAccount.validateRoutingNumber,
    validateAccountNumber: Stripe.bankAccount.validateAccountNumber
  }
});
