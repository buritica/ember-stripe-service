import sinon from 'sinon';
import { module, test } from 'qunit';
import { initialize } from 'dummy/initializers/ember-stripe-service';
import env from 'dummy/config/environment';
import StripeMock from 'ember-stripe-service/utils/stripe-mock';
import { setupTest } from 'ember-qunit';

module('Unit | Initializer | Stripe Service Initializer', function(hooks) {
  setupTest(hooks);

  test('it logs when LOG_STRIPE_SERVICE is set in env config', function(assert) {
    env.LOG_STRIPE_SERVICE = true;

    /* eslint-disable no-console */
    let info = sinon.stub(console, 'log');
    initialize(this.owner.__container__, this.owner);

    assert.ok(info.calledWith('StripeService: initialize'));
    info.restore();
  });

  test('it turns on debugging when LOG_STRIPE_SERVICE is set in env config', function(assert) {
    env.LOG_STRIPE_SERVICE = true;
    env.stripe.debug = undefined; // act like this was never set

    /* eslint-disable no-console */
    let info = sinon.stub(console, 'log');
    initialize(this.owner.__container__, this.owner);

    let stripeConfig = this.owner.__container__.lookup('config:stripe');
    assert.ok(stripeConfig.debug);
    info.restore();
  });

  test('it uses stripe-mock when runing in FastBoot', function(assert) {
    window.FastBoot = true;

    initialize(this.owner.__container__, this.owner);

    assert.equal(window.Stripe, StripeMock);
    delete window.FastBoot;
  });

  test('it uses stripe-mock when mocking is turned on', function(assert) {
    env.stripe.mock = true;

    initialize(this.owner.__container__, this.owner);

    assert.equal(window.Stripe, StripeMock);
  });
});
