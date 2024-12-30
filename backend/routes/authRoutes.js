const express = require('express');
const { signup, login, getUser, reauth, CreateStripeSccount, getStripeStatus, VerifyStripeConnection, HandleReturnURL, generateLoginLink, signupUser, GetCustomer, } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signup/user', signupUser)
router.post('/login', login);

router.post('/create-stripe-account', CreateStripeSccount);
router.get('/stripe-status/:userId', getStripeStatus)
router.post('/verify-stripe-status', VerifyStripeConnection)
router.get('/login-link/:accountId', generateLoginLink);
router.get('/return_url', HandleReturnURL)
router.get('/reauth/:userId', reauth);

router.get('/readAll', GetCustomer)
router.get('/user/:id', getUser);


module.exports = router;
