import Ember from "ember";

export default Ember.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  stripe: Ember.inject.service(),
  actions: {
    checkout: function () {
      var customer = Ember.Object.create({
        stripeToken: null,
        sayHi: () => { return 'HI'; }
      });
      this.get('stripe').card.createToken({
        number: '4111 1111 1111 1111',
        exp_month: '02',
        exp_year: '2020',
        address_zip: '12345'
      }).then((response) => {
        customer.set('stripeToken', response.id);
        this.controller.set('token', response.id);
      });
    }
  }
});
