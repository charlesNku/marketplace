module.exports = (req, res) => {
  try {
    const { app } = require('../backend/app');
    return app(req, res);
  } catch (err) {
    res.status(400).json({ message: `Vercel Crash Log: ${err.message}` });
  }
};
