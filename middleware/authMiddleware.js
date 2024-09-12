const passport = require('passport');

// Middleware to authenticate JWT
exports.protect = passport.authenticate('jwt', { session: false });