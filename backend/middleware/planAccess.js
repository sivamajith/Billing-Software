// Subscription plan feature gates are disabled for this app build.
// The middleware remains in place for compatibility, but it now allows all requests through.
module.exports = function verifyPlanAccess() {
  return async (req, res, next) => {
    next();
  };
};

