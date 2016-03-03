/* global Stripe */
import Ember from 'ember';
import config from '../config/environment';
var debug = config.LOG_STRIPE_SERVICE;

export function initialize() {
  if (typeof FastBoot !== "undefined") {
    return;
  }

  if (debug) {
    Ember.Logger.info('StripeService: initialize');
  }

  if (!config.stripe.publishableKey) {
    throw new Ember.Error('StripeService: Missing Stripe key, please set `ENV.stripe.publishableKey` in config.environment.js');
  }

  Stripe.setPublishableKey(config.stripe.publishableKey);
}

export default {
  name: 'stripe',
  initialize: initialize
};
