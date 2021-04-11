const User = require("../models/User");
const passport = require('passport');
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signUp');
};

usersCtrl.signUp = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Passwords do not match' });
    }
    if (password.lenght < 8 || confirm_password.lenght < 8) {
        errors.push({ text: 'Passwords must contain at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('users/signUp', {
            errors,
            name,
            email
        })
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'This email is already in use');
            res.redirect('/users/signUp');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Account registered');
            res.redirect('/users/signIn');
        }
    }
};

usersCtrl.renderSignInForm = (req, res) => {
    res.render('users/signIn');
};

usersCtrl.signIn = passport.authenticate('local', {
    failureRedirect: '/users/signIn',
    successRedirect: '/notes',
    failureFlash: true
})

usersCtrl.logOut = (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Logged out');
    res.redirect('/users/signIn');
};

module.exports = usersCtrl;