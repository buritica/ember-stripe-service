/* global Stripe */
import config from '../config/environment';
import Ember from 'ember';
var debug = config.LOG_STRIPE_SERVICE;

function createCardToken (card) {
  if (debug) {
    Ember.Logger.info('StripeService: getStripeToken - card:', card);
  }

  return new Ember.RSVP.Promise(function (resolve, reject) {
    Stripe.card.createToken(card, function (status, response) {

      if (debug) {
        Ember.Logger.info('StripeService: card.createToken handler - status %s, response:', status, response);
      }

      Ember.run(null, response.error ? reject : resolve, response);
    });
  });
}

function createCardTokenDeprecated(card) {
  Ember.deprecate('`EmberStripeService.createToken` has been deprecated in ' +
                  'favour of `EmberStripeService.card.createToken` to match ' +
                  'the Stripe API.');
  return createCardToken(card);
}

function createBankAccountToken(bankAccount) {
  if (debug) {
    Ember.Logger.info('StripeService: getStripeToken - bankAccount:', bankAccount);
  }

  return new Ember.RSVP.Promise(function (resolve, reject) {
    Stripe.bankAccount.createToken(bankAccount, function (status, response) {

      if (debug) {
        Ember.Logger.info('StripeService: bankAccount.createToken handler - status %s, response:', status, response);
      }

      Ember.run(null, response.error ? reject : resolve, response);
    });
  });
}

export default Ember.Service.extend({
  createToken: createCardTokenDeprecated,
  card: {
    createToken: createCardToken,
  },
  bankAccount: {
    createToken: createBankAccountToken,
  }
});
