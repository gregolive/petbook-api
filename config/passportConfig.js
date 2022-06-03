import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import JWTStrategy from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const initialize = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy.Strategy((username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { username: 'Username not found' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user); // passwords match, log user in
          } else {
            return done(null, false, { password: 'Incorrect password' }); // passwords do not match
          }
        });
      });
    })
  );

  passport.use(
    new FacebookStrategy.Strategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3001/api/v1/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email', 'photos'],
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({ 'provider_id' : profile.id }, (err, user) => {
        if (err) { return done(err); }
        // Facebook account has not logged in before
        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            email_verified : true,
            provider : 'facebook',
            provider_id : profile.id,    
          });
          newUser.save((error) => {
            if (error) { return done(error); }
            return done(null, newUser);
          });
        } else {
          // Facebook account has previously logged in
          return done(null, user);
        }
      });
    })
  );

  passport.use(
    new GoogleStrategy.Strategy({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: 'http://localhost:3001/api/v1/auth/google/callback',
    }, (_accessToken, _refreshToken, profile, done) => {
      User.findOne({ 'provider_id' : profile.id }, (err, user) => {
        if (err) { return done(err); }
        // Google account has not logged in before
        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            email_verified : true,
            provider : 'google',
            provider_id : profile.id,    
          });
          newUser.save((error) => {
            if (error) { return done(error); }
            return done(null, newUser);
          });
        }
        // Google account has previously logged in
        return done(null, user);
      });
    })
  );

  passport.use(
    new JWTStrategy.Strategy({
      jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey : process.env.TOKEN_ACCESS_SECRET,
    }, (jwtPayload, callback) => {
      return User.findOneById(jwtPayload.id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    })
  );
};

export default initialize;
