module.exports = function(args, finished) {
  
  let body = args.req.body;
  if (!body) {
    return finished({error: 'Invalid login attempt'});
  }
  let username = body.username;
  if (!username || username === '') {
    return finished({error: 'Invalid login attempt'});
  }
  let password = body.password;
  if (!password || password === '') {
    return finished({error: 'Invalid login attempt'});
  }
  
  if (username !== 'rob' || password !== 'secret') {
    return finished({error: 'Invalid login attempt'});
  }
  
  args.session.timeout = 1200;
  args.session.authenticated = true;
  args.session.username = username;
  
  finished({
    ok: true
  });
};
