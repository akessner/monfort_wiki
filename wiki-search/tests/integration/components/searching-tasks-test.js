import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('searching-tasks', 'Integration | Component | searching tasks', {
  integration: true
});

test('Table is populated', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{searching-tasks}}`);

  assert.equal(this.$('tr').length, 1);

   this.set('mock-tasks',  [{"query": "New York", "status":"Pending", "result":{"status":"pending"}},
     {"query": "California", "status":"Done", "result":{"state":"California", "population": 23145200}},
     {"query": "Tel Aviv", "status":"Done", "result":{"city":"Tel Aviv", "population": 120000}}
     ]);

  this.render(hbs`{{searching-tasks tasks=mock-tasks}}`);
  assert.equal(this.$('tr').length, 4);

});
