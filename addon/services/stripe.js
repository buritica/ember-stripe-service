/* global Stripe */
import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);

    this.card = {
      createToken: this._createCardToken.bind(this)
    };

    this.bankAccount = {
      createToken: this._createBankAccountToken.bind(this)
    };

    this.piiData = {
      createToken: this._createPiiDataToken.bind(this)
    };

    if (typeof FastBoot === 'undefined') {
      this._checkForAndAddCardFn('cardType', Stripe.card.cardType);
      this._checkForAndAddCardFn('validateCardNumber', Stripe.card.validateCardNumber);
      this._checkForAndAddCardFn('validateCVC', Stripe.card.validateCVC);
      this._checkForAndAddCardFn('validateExpiry', Stripe.card.validateExpiry);
    }
  },

  /**
  * Creates a creditCard token using Stripe.js API, exposed as `card.createToken`
  * @param  {ojbect} card  CreditCard
  * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
  *                        status is not being returned at the moment but it can be logged
  */
  _createCardToken(card) {
    if (typeof FastBoot !== 'undefined') {
      return;
    }
    this.debug('card.createToken:', card);

    return new Ember.RSVP.Promise((resolve, reject) => {
      Stripe.card.createToken(card, (status, response) => {

        this.debug('card.createToken handler - status %s, response:', status, response);

        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
  * Creates a BankAccout token using Stripe.js API, exposed as `bankAccount.createToken`
  * @param  {ojbect} bankAccount
  * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
  *                        Status is not being returned at the moment but it can be logged
  *
  */
  _createBankAccountToken(bankAccount) {
    if (typeof FastBoot !== 'undefined') {
      return;
    }
    this.debug('bankAccount.createToken:', bankAccount);

    return new Ember.RSVP.Promise((resolve, reject) => {
      Stripe.bankAccount.createToken(bankAccount, (status, response) => {

        this.debug('bankAccount.createToken handler - status %s, response:', status, response);

        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
   * Creates a piiData token using Stripe.js API, exposed as `piiData.createToken`
   * @param  {object} piiData  PiiData
   * @return {promise}         Returns a promise that holds response, see stripe.js docs for details
   *                           status is not being returned at the moment but it can be logged
   */
  _createPiiDataToken(piiData) {
    if (typeof FastBoot !== 'undefined') {
      return;
    }
    this.debug('piiData.createToken:', piiData);

    return new Ember.RSVP.Promise((resolve, reject) => {
      Stripe.piiData.createToken(piiData, (status, response) => {

        this.debug('piiData.createToken handler - status %s, response:', status, response);

        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });

  },

  /**
   * Uses Ember.Logger.info to output service information if LOG_STRIPE_SERVICE is
   * set
   *
   * notes:
   * - proxies all arguments to Ember.Logger.info
   * - pre-pends StripeService to all messages
   */
  debug() {
    let config = this.get('config');
    let debuggingEnabled = (config && typeof config.LOG_STRIPE_SERVICE !== 'undefined') ? config.LOG_STRIPE_SERVICE : false;

    if (debuggingEnabled) {
      let args = Array.prototype.slice.call(arguments);
      args[0] = `StripeService: ${args[0]}`;
      Ember.Logger.info.apply(null, args);
    }
  },

  _checkForAndAddCardFn(name, fn) {
    if (typeof FastBoot !== 'undefined') {
      return;
    }
    if (Ember.isEqual(Ember.typeOf(Stripe.card[name]), 'function')) {
      this.card[name] = fn;
    } else {
      this.card[name] = Ember.K;
      Ember.Logger.error(`ember-cli-stripe: ${name} on Stripe.card is no longer available`);
    }
  }
});
