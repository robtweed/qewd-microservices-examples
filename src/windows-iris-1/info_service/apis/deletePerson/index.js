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
  */
  
  if (!person.exists) {
    return finished({error: 'No person exists with id ' + args.id});
  }

  /*
    Delete the specified Person record
  */

  person.delete();

  /*
    Finish processing and return a success flag as the response
  */

  finished({
    ok: true
  });
  
};