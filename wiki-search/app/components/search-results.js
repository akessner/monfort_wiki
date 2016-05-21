import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    const model = this.get('model');
    if (typeof model === 'string') {
      this.set('model', JSON.parse(model));
    } else {
      this.set('model', model);
    }
  }
});
