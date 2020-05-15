module.exports = function(args, finished) {

  /*
    Check the JWT to make sure it's for a user who has logged in
    and has therefore authenticated

    Note that even though this is a reserved/secret property within
    the JWT, it is automatically decrypted and made available for
    your use in your handler modules
  */

  if (!args.session.authenticated) {
    return finished({error: 'Not authenticated'});
  }

  /*
    Next, check the incoming POST body to make sure
    it exists and contains valid values

    If an error is detected, return an error object as
    the response

  */

  let body = args.req.body;
  if (!body) {
    return finished({error: 'Invalid request'});
  }
  let name = body.name;
  if (!name || name === '') {
    return finished({error: 'Missing name value'});
  }

  let gender = body.gender;
  if (!gender || gender === '') {
    return finished({error: 'Missing gender value'});
  }

  let city = body.city;
  if (!city || city === '') {
    return finished({error: 'Missing city value'});
  }

  /*

    The incoming request contained valid values
    so now we'll save them as a new Person record

    First, instantiate a Document Node object that
    represents the Person Global

  */

  let persons = this.db.use('Person');

  /*
    Create a new Person Id by incrementing the id_counter value
  */


  let id = persons.$('id_counter').increment();

  /*
    Instantiate a Document Node Object representing the
    new Person record using the id
  */

  let person = persons.$(['by_id', id]);

  /*
    Save the data for this new Person record
  */

  person.setDocument({
    name: name,
    gender: gender,
    city: city
  }); 
  
  /*
    Finish processing, and return the new Person id
  */

  finished({
    ok: true,
    id: id
  });
};
