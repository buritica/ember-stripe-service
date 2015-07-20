import Ember from 'ember';
import config from '../config/environment';
import getStripeLibrary from 'ember-stripe-service/get-stripe-library';

var debug = config.LOG_STRIPE_SERVICE;

export function initialize() {
  if (debug) {
    Ember.Logger.info('StripeService: initialize');
  }

  if (!config.stripe.publishableKey) {
    throw new Ember.Error('StripeService: Missing Stripe key, please set `ENV.stripe.publishableKey` in config.environment.js');
  }

  if (!config.stripe.lazyLoad) {
    return getStripeLibrary(config.stripe.publishableKey);
  }
}

export default {
  name: 'stripe',
  initialize: initialize
};
