import LocalStrategy from 'passport-local';
import JWTStrategy from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const initialize = (passport) => {
  passport.use(
    new LocalStrategy.Strategy((username, password, done) => {
      User.findOne({ username}, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Username not found' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user); // passwords match, log user in
          } else {
            return done(null, false, { message: 'Incorrect password' }); // passwords do not match
          }
        });
      });
    })
  );

  passport.use(new JWTStrategy.Strategy({
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
  }));
};

export default initialize;
