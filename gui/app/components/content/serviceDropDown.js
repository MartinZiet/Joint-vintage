angular.module('joint.services')
.service('dropList', function($q,Restangular) {
  var q = $q.defer();
  Restangular.all('objects').doGET().then(function(resp) {
    var ListPK = {};
    var root = undefined;
    for(var i=0; i<resp.length; i++){
      var id = resp[i].id;
      var p_id = resp[i].parent_id;

      if(ListPK[p_id]===undefined){
        ListPK[p_id] = [];
      }
      if(ListPK[id]===undefined){
        ListPK[id] = [];
      }
      if(p_id=='0'){
        root = resp[i];
      }
      ListPK[p_id].push(resp[i]);
      resp[i].children = ListPK[id];
    }
    console.log(resp);
    q.resolve(resp);
  });
  return {
    getList: q.promise
  }
});