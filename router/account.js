const express = require('express');
const router = express.Router();
const {
    getAccount,
    updateAccount,
    getUser,
    createNewUser,
    loginAccount,
    requestRefreshToken,
    profileAccount,
    userLogout,
    deleteAccount
} = require('../controllers/admin');

const middlewareToken = require('../middleware/authenticate');

router.get('/account', getUser);
router.get('/account/:id', getAccount);
router.post('/account/register', createNewUser);
router.post('/account/login', loginAccount);
router.get('/profile', middlewareToken.verifyToken, profileAccount);
router.get('/refresh', requestRefreshToken);
router.get('/logout', userLogout);
router.put('/account/:id', updateAccount);
router.delete('/account/:id', deleteAccount)
module.exports = router;