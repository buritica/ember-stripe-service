import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import config from 'dummy/config/environment';

module('Acceptance | Initializer logging', function(hooks) {
  hooks.beforeEach(function() {
    this.info = sinon.stub(console, 'log');
    this._original_LOG_STRIPE_SERVICE = config.LOG_STRIPE_SERVICE;
  });

  setupTest(hooks);

  hooks.afterEach(function() {
    this.info.restore();
    config.LOG_STRIPE_SERVICE = this._original_LOG_STRIPE_SERVICE;
  });

  test('it logs on app boot when LOG_STRIPE_SERVICE is true', function(assert) {
    config.LOG_STRIPE_SERVICE = true;
    delete config.stripe.debug;

    assert.ok(this.info.called);
  });

  test('it doesn\'t log on app boot when LOG_STRIPE_SERVICE is false', function(assert) {
    config.LOG_STRIPE_SERVICE = false;
    delete config.stripe.debug;

    assert.ok(this.info.notCalled);
  });
});
