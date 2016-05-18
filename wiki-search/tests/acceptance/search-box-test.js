import { test } from 'qunit';
import moduleForAcceptance from 'wiki-search/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | search box');

test('visiting /search', function(assert) {
  visit('/search');

  andThen(function() {
    assert.equal(currentURL(), '/search');
  });
});

test('input search query', function(assert) {
  visit('/');
  fillIn('input#search', 'New York');
  click('input#submit');
  andThen(function() {
    assert.equal($("table td").length, 0);
    //assert.equal($("td")[0].text().trim(), 'New York');
  });
});
