module.exports = function(messageObj, session, send, finished) {

  finished({summary: []});
  return;

  if (!session.authenticated) {
    return finished({error: 'Not authenticated'});
  }

  if (!messageObj.params) {
    return finished({error: 'No params present in request'});
  }
   if (!messageObj.params.properties) {
    return finished({error: 'No properties defined in request'});
  }
  
  let results = [];
  let properties = messageObj.params.properties;
  let names = {};
  properties.forEach(function(property) {
    if (property !== 'id') {
      let name = property.charAt(0).toUpperCase() + property.slice(1)
      names[name] = property;
    }
  });
  
  let db = this.db.dbx;
  let query = db.sql({sql: "select * from SQLUser.Person", type: "Cache"});
  let result = query.execute();
  let res;
  let property;
  
   while ((result = query.next()) !== null) {
      res = {};
      res.id = result.ID;
      for (property in names) {
        res[names[property]] = result[property];
      }
      results.push(res);
   }
   query.cleanup();

   finished({summary: results});

};
