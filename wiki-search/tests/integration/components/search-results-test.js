import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-results', 'Integration | Component | search results', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{search-results}}`);

  assert.equal(this.$().text().trim(), '');

  this.set('result', {"query": "Tel Aviv", "status":"Done", "result":{"city":"Tel Aviv", "population": 120000}});

  // Template block usage:
  this.render(hbs`{{search-results model=result}}`);

  assert.equal(this.$().text().trim(), 'query : Tel Aviv \n    status : Done \n    result : [object Object]');
});
