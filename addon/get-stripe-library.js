/* global Stripe */
import $ from 'jquery';
import Ember from 'ember';

var inflight;

export default function getStripeLibrary(publishableKey) {
  if (typeof Stripe !== 'undefined') {
    return Ember.RSVP.resolve(Stripe);
  }

  if (inflight) { return inflight; }

  inflight = new Ember.RSVP.Promise(function (resolve, reject) {
    const url = 'https://js.stripe.com/v2/';
    $.ajax({
      dataType: "script",
      cache: true,
      url: url
    }).then(
      function() {
        tripe.setPublishableKey(publishableKey);
        resolve(Stripe);
      },
      function() { reject("Failed to load Stripe library"); }
    );
  })
  .finally(function() { inflight = null; });
}
