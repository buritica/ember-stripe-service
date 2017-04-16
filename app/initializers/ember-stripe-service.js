/* global Stripe */
import Ember from 'ember';
import config from '../config/environment';

const isFastBoot = typeof FastBoot !== 'undefined';

export function initialize() {
  const application = arguments[1] || arguments[0];
  application.register('config:ember-stripe-service', config, { instantiate: false });
  application.inject('service:stripe', 'config', 'config:ember-stripe-service');

  if (config.LOG_STRIPE_SERVICE) {
    Ember.Logger.info('StripeService: initialize');
  }

  if (!config.stripe.publishableKey) {
    throw new Ember.Error('StripeService: Missing Stripe key, please set `ENV.stripe.publishableKey` in config.environment.js');
  }

  if (isFastBoot) {
    Ember.Logger.info('StripeService: Unavailable with FastBoot');
  } else {
    Stripe.setPublishableKey(config.stripe.publishableKey);
  }

}

export default {
  name: 'ember-stripe-stripe',
  initialize: initialize
};
