const { Router } = require("express");
const router = Router();
const {challenge, testCase,challengeDiscussion,contest} = require("../controllers/apiController")
const authenticate = require('../middlewares/authenticate');
const { check} = require("express-validator")


router.post("/admin/challenge",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores')
], challenge);

router.post("/testcase/:challenge",  testCase);

router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);


router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/contest/new/:token",authenticate, contest);


module.exports = router;