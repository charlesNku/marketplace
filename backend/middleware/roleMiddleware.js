const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const trader = (req, res, next) => {
  if (req.user && (req.user.role === 'trader' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a trader' });
  }
};

module.exports = { admin, trader };
