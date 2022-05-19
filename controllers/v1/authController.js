import passport from 'passport';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: info, user });
    }
    req.login(user, { session: false }, (err) => {
      if (err) { res.send(err); }
      const token = jwt.sign({ user }, process.env.TOKEN_ACCESS_SECRET);
      return res.json({ token });
    });
  })(req, res);
};
