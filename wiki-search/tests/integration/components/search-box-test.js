import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-box', 'Integration | Component | search box', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{search-box}}`);
  assert.equal(this.$('div').text().trim(), 'Enter a City, State, or Country');
});
