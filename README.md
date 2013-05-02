# Passport-Odesk

[Passport](http://passportjs.org/) strategy for authenticating with [Odesk](https://www.odesk.com/)
using the OAuth 1.0a API.

This module lets you authenticate using Odesk in your Node.js applications.
By plugging into Passport, Odesk authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-odesk

## Usage

#### Configure Strategy

We need to get this keyes from odesk api. I think the odesk team knows it better,
As for me, i was simply provided with this dada

    passport.use(new OdeskStrategy({
        consumerKey: 'f448b92c4aaf8918c0106bd164a1656',
        consumerSecret: 'e6a71b4f05467054',
        callbackURL: "http://127.0.0.1:3000/auth/odesk/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ id: profile._id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'odesk'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/odesk',
      passport.authenticate('odesk'));
    
    app.get('/auth/odesk/callback',
      passport.authenticate('odesk', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signin example](https://github.com/vodolaz095/passport-odesk/tree/master/examples/signin).



## Odesk Data Example
``
    {"server_time":"1367492929",
        "auth_user":
            {
                "first_name":"John",
                "last_name":"Doe",
                "uid":"John Doe",
                "mail":"JohnDoe@odesk.com",
                "messenger_id":"",
                "messenger_type":"",
                "timezone":"Europe\/Klin",
                "timezone_offset":"14400"
            },
            "info":
            {
                "portrait_50_img":"https:\/\/odesk-prod-portraits.s3.amazonaws.com\/Users:romanov_klin:PortraitUrl_50?AWSAccessKeyId=1XVAX3FNQZAFC9GJCFR2&Expires=2147483647&Signature=P7XYYyZr9c%2Bvv%2F25voKeTg92eFc%3D",
                "ref":"3603850",
                "portrait_32_img":"https:\/\/odesk-prod-portraits.s3.amazonaws.com\/Users:romanov_klin:PortraitUrl_32?AWSAccessKeyId=1XVAX3FNQZAFC9GJCFR2&Expires=2147483647&Signature=IZROy3xeRt260AJ3oPp3M9nJP8g%3D","has_agency":"0","portrait_100_img":"https:\/\/odesk-prod-portraits.s3.amazonaws.com\/Users:romanov_klin:PortraitUrl_100?AWSAccessKeyId=1XVAX3FNQZAFC9GJCFR2&Expires=2147483647&Signature=lOzpO2SN%2BEqwB30YsBeHz1wHMsk%3D",
                "company_url":"",
                "capacity":{"provider":"yes","buyer":"yes","affiliate_manager":"no"},
                "location":{"city":"Klin","state":"","country":"Russia"},
                "profile_url":"https:\/\/www.odesk.com\/users\/~johnDoe"}
            }
``

## Tests

Not implemented, because package is not published at <[http://npmjs.org]>(http://npmjs.org)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Ostroumov Anatolij <[http://teksi.ru/resume/](http://teksi.ru/resume/)>
Based on Plugin <[https://github.com/jaredhanson/passport-twitter](https://github.com/jaredhanson/passport-twitter)>
by Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
