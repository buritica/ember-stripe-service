/* global Stripe */
import config from '../config/environment';
import Ember from 'ember';
var debug = config.LOG_STRIPE_SERVICE;

function createToken (card) {
  if (debug) {
    Ember.Logger.info('StripeService: getStripeToken - card:', card);
  }

  return new Ember.RSVP.Promise(function (resolve, reject) {
    Stripe.card.createToken(card, function (status, response) {

      if (debug) {
        Ember.Logger.info('StripeService: createToken handler - status %s, response:', status, response);
      }

      if (response.error) {
        reject(response);
      }

      resolve(response);

    });
  });
}

export default Ember.Object.extend({
  createToken: createToken
});
