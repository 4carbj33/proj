const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            res.render('user-login', { errors: { email: { message: 'email not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            return
        }

        res.render('user-login', { errors: { password: { message: 'password does not match' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.create = async (req, res) => {
    const SaveUser = new UserModel(req.body)
    SaveUser.save((error, savedUser) => {
        if (error) throw error
        res.redirect("/login")
    })

};