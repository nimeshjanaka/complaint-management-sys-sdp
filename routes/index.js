const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
let User = require('../models/user');
let Complaint = require('../models/complaint');
let ComplaintMapping = require('../models/complaint-mapping');
let UpdateMapping = require('../models/update-mapping');

router.get('/', ensureAuthenticated, (req,res,next) => {
    console.log(req.user.username);
    Complaint.find({ name: req.user.username }, (err, complaints) => {
        if (err) throw err;
        console.log(complaints); // log the complaints
        if (complaints.length > 0) {
            let complaintIds = complaints.map(complaint => complaint._id);
            UpdateMapping.find({ complaintID: { $in: complaintIds } })
            .exec((err, updates) => {
                if (err) throw err;
                console.log(updates); // log the updates
                res.render('index', {
                    updates : updates
                });
            });
        } else {
            console.log('No complaints found with the provided name');
            res.render('index');
        }
    });
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register');
});


router.get('/logout', ensureAuthenticated,(req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

router.get('/admin', ensureAuthenticated, (req,res,next) => {
    Complaint.getAllComplaints((err, complaints) => {
        if (err) throw err;
    
        User.getEngineer((err, engineer) => {
            if (err) throw err;

            UpdateMapping.find({}, (err, updates) => {
                if (err) throw err;

                res.render('admin/admin', {
                    complaints : complaints,
                    engineer : engineer,
                    updates: updates
                });
            });
        });
    });        
});


router.post('/update-complaintwild', (req, res, next) => {
    let mongoose = require('mongoose');
    const complaintID = mongoose.Types.ObjectId(req.body.complaintID); // Convert complaintID to ObjectId
    const update = req.body.update;
    const engineerName = req.user.username;

    req.checkBody('complaintID', 'Complaint ID field is required').notEmpty();
    req.checkBody('update', 'Update field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('junior/juniorwildlife', {
            errors: errors
        });
    } else {
        const newUpdateMapping = new UpdateMapping({
            complaintID: complaintID,
            engineerName: engineerName,
            update: update
        });

        UpdateMapping.registerUpdate(newUpdateMapping, (err, update) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully updated the complaint');
            res.redirect('/jeng');
        });
    }
});

router.post('/update-complaintforest', (req, res, next) => {
    let mongoose = require('mongoose');
    const complaintID = mongoose.Types.ObjectId(req.body.complaintID); // Convert complaintID to ObjectId
    const update = req.body.update;
    const engineerName = req.user.username;

    req.checkBody('complaintID', 'Complaint ID field is required').notEmpty();
    req.checkBody('update', 'Update field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('junior/juniorforest', {
            errors: errors
        });
    } else {
        const newUpdateMapping = new UpdateMapping({
            complaintID: complaintID,
            engineerName: engineerName,
            update: update
        });

        UpdateMapping.registerUpdate(newUpdateMapping, (err, update) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully updated the complaint');
            res.redirect('/jeng');
        });
    }
});
// router.post('/update-complaint', ensureAuthenticated, (req, res, next) => {
//     let mongoose = require('mongoose');
//     const complaintID = mongoose.Types.ObjectId(req.body.complaintID);
//     let update = req.body.update;
//     console.log(complaintID);
//     // Find the complaint in the database...
//     ComplaintMapping.findOne({ complaintID: complaintID })
//     .populate('complaintID')
//     .exec((err, complaint) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send('Server error');
//         }

//         if (complaint) {
//             // Set up Nodemailer...
//             let transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'asfafafsaf',
//                     pass: 'aasfafdafa'
//                 }
//             });
//             console.log(complaint.complaintID.email);
//             // Set up the email options...
//             let mailOptions = {
//                 from: 'afsafafa.com',
//                 to: complaint.complaintID.email,
//                 subject: 'Complaint Update',
//                 text: update
//             };

//             // Send the email...
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log(error);
//                     res.status(500).send('Error while sending email.');
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                     res.status(200).send('Update email sent!');
//                 }
//             });
//         } else {
//             console.log('No complaint found with the provided ID');
//             res.status(404).send('No complaint found with the provided ID');
//         }
//     });
// });

router.post('/assign', (req,res,next) => {
    const complaintID = req.body.complaintID;
    const depName = req.body.depName;

    req.checkBody('complaintID', 'Contact field is required').notEmpty();
    req.checkBody('depName', 'Description field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/admin', {
            errors: errors
        });
    } else {
        const newComplaintMapping = new ComplaintMapping({
            complaintID: complaintID,
            depName: depName,
        });

        ComplaintMapping.registerMapping(newComplaintMapping, (err, complaint) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully assigned a complaint to Engineer');
            res.redirect('/admin');
        });
    }

});

router.get('/jeng', ensureAuthenticated, (req, res, next) => {
    ComplaintMapping.find({ engineerName: req.user.username })
    .populate('complaintID')
    .exec((err, assignedComplaints) => {
        if (err) throw err;
        console.log(assignedComplaints);
        res.render('junior/junior', {
            assignedComplaints: assignedComplaints
        });
    });
});

router.get('/jengforest', ensureAuthenticated, (req, res, next) => {
    ComplaintMapping.find({ depName: req.user.role })
    .populate('complaintID')
    .exec((err, assignedComplaints) => {
        if (err) throw err;
        console.log(assignedComplaints);
        res.render('junior/juniorforest', {
            assignedComplaints: assignedComplaints
        });
    });
});

router.get('/jengwildlife', ensureAuthenticated, (req, res, next) => {
    ComplaintMapping.find({ depName: req.user.role })
    .populate('complaintID')
    .exec((err, assignedComplaints) => {
        if (err) throw err;
        console.log(assignedComplaints);
        res.render('junior/juniorwildlife', {
            assignedComplaints: assignedComplaints
        });
    });
});

router.get('/complaint', ensureAuthenticated, (req, res, next) => {
    //console.log(req.session.passport.username);
    //console.log(user.name);
    res.render('complaint', {
        username: req.session.user,
    });
});


router.post('/registerComplaint', (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const desc = req.body.desc;
    
    const postBody = req.body;
    console.log(postBody);

    req.checkBody('contact', 'Contact field is required').notEmpty();
    req.checkBody('desc', 'Description field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('complaint', {
            errors: errors
        });
    } else {
        const newComplaint = new Complaint({
            name: name,
            email: email,
            contact: contact,
            desc: desc,
        });

        Complaint.registerComplaint(newComplaint, (err, complaint) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully launched a complaint');
            res.redirect('/');
        });
    }
});




router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('role', 'Role option is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password,
            role: role
        });

        User.registerUser(newUser, (err, user) => {
            if (err) throw err;
            req.flash('success_msg', 'You are Successfully Registered and can Log in');
            res.redirect('/login');
        });
    }
});


passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'No user found'
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Wrong Password'
                });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    var sessionUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
    }
    done(null, sessionUser);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, sessionUser) => {
        done(err, sessionUser);
    });
});


router.post('/login', passport.authenticate('local', 
    { 
        failureRedirect: '/login', 
        failureFlash: true 
    
    }), (req, res, next) => {
    
        req.session.save((err) => {
        if (err) {
            return next(err);
        }
        if(req.user.role==='admin'){
            res.redirect('/admin');
        }
        else if(req.user.role==='jengforest'){
            res.redirect('/jengforest');
        }
        else if(req.user.role==='jengwildlife'){
            res.redirect('/jengwildlife');
        }

        else{
            res.redirect('/');
        }
    });
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not Authorized to view this page');
        res.redirect('/login');
    }
}

module.exports = router;