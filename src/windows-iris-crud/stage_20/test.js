  var qewd_mg_dbx = require('qewd-mg-dbx');

  var params = {
    database: {
          "type": "Cache",
          "path": "C:\\InterSystems\\Cache2015\\Mgr",
          "username": "_SYSTEM",
          "password": "SYS",
          "namespace": "USER"
    }
  };

  var db = new qewd_mg_dbx(params);
  var status = db.open();
  console.log(status);
  
  db.close();
  
  