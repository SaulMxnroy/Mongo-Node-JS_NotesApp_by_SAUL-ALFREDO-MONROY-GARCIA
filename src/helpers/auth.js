const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Warning, an unauthorized access attempt has been detected to a profile registered in our system. This is punishable by computer security laws. Your IP address and MAC address have been recorded for future evidence.');
    res.redirect('/users/signIn');
}

module.exports = helpers;