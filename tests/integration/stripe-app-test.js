import Ember from "ember";
import startApp from '../helpers/start-app';
import {module, test} from 'qunit';

module("Integration - Stripe - Checkout", {
  beforeEach: function() {
    this.App = startApp();
  },
  afterEach: function() {
    Ember.run(this.App, 'destroy');
  }
});

test('it creates token and set\'s it to customer', function (assert) {
  visit('/');

  andThen(() => {
    return click('#checkout');
  });

  andThen(() => {
    assert.ok(find('.text #token').text().length > 0, 'token is not empty');
  });
});
