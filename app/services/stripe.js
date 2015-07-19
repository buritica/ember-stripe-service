/* global Stripe */
import env from '../config/environment';
import Ember from 'ember';

/**
 * Uses Ember.Logger.info to output service information if LOG_STRIPE_SERVICE is
 * set
 *
 * notes:
 * - proxies all arguments to Ember.Logger.info
 * - pre-pends StripeService to all messages
 */
function debug() {
  var debuggingEnabled = (typeof env.LOG_STRIPE_SERVICE !== 'undefined');

  if (!debuggingEnabled) {
    return false;
  }

  var args = Array.prototype.slice.call(arguments);
  args[0] = `StripeService: ${args[0]}`;
  Ember.Logger.info.apply(null, args);
}

/**
 * Creates a creditCard token using Stripe.js API, exposed as `card.createToken`
 * @param  {ojbect} card  CreditCard
 * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
 *                        status is not being returned at the moment but it can be logged
 */
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

/**
 * Alias to `card.createToken`, exposed as `createCardToken`
 * @deprecated please see `card.createToken` for usage
 */
function createCardTokenDeprecated(card) {
  Ember.deprecate(
    '`EmberStripeService.createToken` has been deprecated in ' +
    'favor of `EmberStripeService.card.createToken` to match ' +
    'the Stripe API.'
  );
  return createCardToken(card);
}

/**
 * Creates a BankAccout token using Stripe.js API, exposed as `bankAccount.createToken`
 * @param  {ojbect} bankAccount
 * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
 *                        Status is not being returned at the moment but it can be logged
 *
 */
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
export default Ember.Object.extend({
  createToken: createCardTokenDeprecated,
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
