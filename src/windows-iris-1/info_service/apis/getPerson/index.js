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
    Instantiate a DocumentNode Object representing the
    Global node for the specified Person record
  */

  let person = this.db.use('Person', 'by_id', args.id);

  /*
    Check if a Person record with that id was found

    If not, return an error object

  */
  
  if (!person.exists) {
    return finished({error: 'No person exists with id ' + args.id});
  }

  /*
    Map the persistent record into a local JavaScript object
    by using the getDocument() method

    We could have alternatively fetched each value using the 
    value method for each property
  */

  let record = person.getDocument();

  /*
    Finish processing, and return the Person data
  */

  finished({
    ok: true,
    data: record
  });
  
};
