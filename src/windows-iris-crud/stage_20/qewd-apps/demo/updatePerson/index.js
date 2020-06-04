let cclass = require('mg-dbx').mclass;

module.exports = function(messageObj, session, send, finished) {

  if (!session.authenticated) {
    return finished({error: 'Not authenticated'});
  }

  if (!messageObj.params) {
    return finished({error: 'No params present in request'});
  }

  let name = messageObj.params.name;
  if (!name || name === '') {
    return finished({error: 'Missing name value'});
  }

  let gender = messageObj.params.gender;
  if (!gender || gender === '' || gender === 'invalid') {
    return finished({error: 'Missing gender value'});
  }

  let city = messageObj.params.city;
  if (!city || city === '') {
    return finished({error: 'Missing city value'});
  }     

  let db = this.db.dbx;
  
  /*
    Instantiate a new Person instance
  */

  //let person = db.classmethod('User.Person', '%New');
  let person = new cclass(db, 'User.Person', '%New');

  /*
    mg-dbx allows us to set properties using the setproperty method
  */

  person.setproperty('Name', name);
  person.setproperty('Gender', gender);
  person.setproperty('City', city);
  
  /*
    person methods are invoked using the mg-dbx method function

    We'll save the person instance, get the id that was allocated to it
    and close the instance

  */

  person.method('%Save');
  let id = person.method('%Id');
  person.method('%Close'); 
 
    finished({
      ok: true,
      id: id
    });
};
