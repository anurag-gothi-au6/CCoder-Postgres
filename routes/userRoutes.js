const { Router } = require("express");

const router = Router();

const authenticate = require('../middlewares/authenticate');

const { check} = require("express-validator")

const { userRegister, userLogin, singleUser, userLogout, userProfileUpdate, userChangePassword } = require('../controllers/userController')

router.post('/user/register',
    [
        check('username')
            .isLength({ min: 4}).trim()
            .withMessage('Username cannot be empty.')
            .matches(/^[a-zA-Z0-9_]+$/, 'i')
            .withMessage('Username must be alphanumeric, and can contain underscores'),
        check('email').isEmail(),
        check('password')
            .isLength({ min: 8, max: 100})
            .withMessage('Password must be between 8-100 characters long.')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
            .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),
    ]
, userRegister);

router.post('/user/login', userLogin);

router.get('/user/me/:token', authenticate, singleUser);

router.delete('/user/logout/:token', authenticate, userLogout);

router.patch('/user/userprofile/:token',[
    check('username')
        .isLength({ min: 4}).trim()
        .withMessage('Username must have minimum 4 characters.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Username must be alphanumeric, and can contain underscores'),
    authenticate
] , userProfileUpdate);

router.patch('/user/changepassword/:token',[
    check('newpassword')
        .isLength({ min: 8, max: 100})
        .withMessage('Password must be between 8-100 characters long.')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
        .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),
    authenticate],
userChangePassword);


module.exports = router;