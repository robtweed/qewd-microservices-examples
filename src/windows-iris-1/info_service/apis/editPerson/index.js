module.exports = function(args, finished) {

  /*
    Check the JWT to make sure it's for a user who has logged in
    and has therefore authenticated
  */

  if (!args.session.authenticated) {
    return finished({error: 'Not authenticated'});
  }

  /*
    Next, check that an id has been specified. Variables within the
    URI path are exposed as properties of args, so:

  */

  if (!args.id || args.id === '') {
    return finished({error: 'Invalid request'});
  }

  /*
    Next, check the incoming PUT body to make sure
    it exists
  */

  let body = args.req.body;
  if (!body) {
    return finished({error: 'Invalid request'});
  }

  /*
    Instantiate a DocumentNode Object representing the
    Global node for the specified Person record
  */

  let person = this.db.use('Person', 'by_id', args.id);

  /*
    Check if a Person record with that id was found
  */
  
  if (!person.exists) {
    return finished({error: 'No person exists with id ' + args.id});
  }

  /*
    Check for each Person property in the body, and
    if a new value exists, update the Person record
  */

  let name = body.name;
  if (name && name !== '') {
    person.$('name').value = name;
  }

  let gender = body.gender;
  if (gender && gender !== '') {
    person.$('gender').value = gender;
  }

  let city = body.city;
  if (city && city !== '') {
    person.$('city').value = city;
  }

  /*
    Finish processing and return a success flag as the response
  */
  
  finished({
    ok: true
  });
  
};
