/* eslint-env node */
'use strict';

module.exports = {
  name: require('./package').name,
  contentFor: function(type, config) {
    let stripeConfig = config.stripe || {};

    var lazyLoad = stripeConfig.lazyLoad;
    var mock = stripeConfig.mock;

    if (type === 'body' && !lazyLoad && !mock) {
      return '<script type="text/javascript" src="https://js.stripe.com/v2/"></script>';
    }
  },

  isDevelopingAddon: function() {
    return false;
  }
};
