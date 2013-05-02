/**
 * Module dependencies.
 */
var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Odesk authentication strategy authenticates requests by delegating to
 * Odesk using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Odesk
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Odesk will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new OdeskStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/odesk/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://www.odesk.com/api/auth/v1/oauth/token/request'//'https://api.twitter.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || 'https://www.odesk.com/api/auth/v1/oauth/token/access',//'https://api.twitter.com/oauth/access_token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://www.odesk.com/services/api/auth'//'https://api.twitter.com/oauth/authenticate';
  options.sessionKey = options.sessionKey || 'oauth:twitter';//sprry, i don't know why, but it has to be like this...

  OAuthStrategy.call(this, options, verify);
  this.name = 'odesk'//'twitter';
  
  this._skipExtendedUserProfile = (options.skipExtendedUserProfile === undefined) ? false : options.skipExtendedUserProfile;
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);


/**
 * Authenticate request by delegating to Twitter using OAuth.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  // When a user denies authorization on Twitter, they are presented with a link
  // to return to the application in the following format (where xxx is the
  // value of the request token):
  //
  //     http://www.example.com/auth/twitter/callback?denied=xxx
  //
  // Following the link back to the application is interpreted as an
  // authentication failure.
  if (req.query && req.query.denied) {
    return this.fail();
  }
  
  // Call the base class for standard OAuth authentication.
  OAuthStrategy.prototype.authenticate.call(this, req, options);
}

/**
 * Retrieve user profile from Twitter.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `_id`        (equivalent to `user_id`)
 *   - `name`  (equivalent to `name`)
 *
 * Note that because Twitter supplies basic profile information in query
 * parameters when redirecting back to the application, loading of Twitter
 * profiles *does not* result in an additional HTTP request, when the
 * `skipExtendedUserProfile` is enabled.
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  if (!this._skipExtendedUserProfile) {
    this._oauth.get(
        'https://www.odesk.com/api/auth/v1/info.json',
        //'https://api.twitter.com/1/users/show.json?user_id=' + params.user_id,
        token, tokenSecret, function (err, body, res) {
      if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
      
      try {
        console.log(body);

        var data = JSON.parse(body);
          var profile = {
              provider: 'odesk',
              _id :  data.auth_user.uid,
              accessToken : token,
              accessTokenSecret : tokenSecret,

              ref : data.info.ref,
              name : data.auth_user.first_name + " " + data.auth_user.last_name,
              img : data.info.portrait_100_img,
              country : data.info.location.country,
              profile : data.info.profile_url
          };

        done(null, profile);
      } catch(e) {
        done(e);
      }
    });
  } else {
    var profile = { provider: 'odesk' };
    profile._id = params.auth_user.uid;
    profile.name = params.auth_user.first_name + " " + params.auth_user.last_name;
    done(null, profile);
  }
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
