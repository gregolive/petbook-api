import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    let tokenData;
    try {
      tokenData = jwt.verify(token, process.env.TOKEN_ACCESS_SECRET);
    } catch (err) {
      return res.status(401);
    }
    res.locals.user = tokenData.user;
    next();
  }

  return res.status(500);
};

export default verifyToken;
