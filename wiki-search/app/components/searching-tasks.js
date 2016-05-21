import Ember from 'ember';

export default Ember.Component.extend({

  polling: 0,
  actions: {

    doSearch: function() {
      var searching_tasks = this;
      Ember.$.get('http://localhost:5000?query='+Ember.$("#search").val(), function(response) {
        console.log("got response ", response);
        searching_tasks.set('polling', 0)
        searching_tasks.pollRequest();
      });
    },
  },

  pollRequest: function() {
    this.request();
    this.set('polling', this.get('polling')+1)
    if (this.get('polling') < 30 ){
      Ember.run.later(this, this.pollRequest, 500);
    }
  },

  request: function () {
    var searching_tasks = this;
    Ember.$.getJSON('http://localhost:5000/api/v1.0/wiki', function(data) {
      //console.log("first data from api: " + Ember.inspect(data) );
      data = data.sortBy("date").reverse();
      var parsedData = [];

      var iterations = data.length > 5? 5 : data.length;
      for (var i = 0; i < iterations; i ++){
        parsedData[i] = JSON.parse(data[i]);
      }
      searching_tasks.set('tasks', parsedData);
    });
  },
});
