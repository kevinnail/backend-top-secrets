module.exports = async (req, res, next) => {
  try {
    // if (!req.user || req.user.email !== '@defense.gov')
    if (!req.user || !req.user.email.includes('@defense.gov'))
      throw new Error('You do not have access to view this page');
    next();
  } catch (e) {
    next(e);
  }
};
