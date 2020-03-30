const { Router } = require("express");
const router = Router();
const {challenge, testCase, submission} = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');
const { check} = require("express-validator")

router.post("/admin/challenge",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores')
], challenge);
router.post("/testcase/:challenge", testCase);
router.post("/submit/:challenge/:token",authenticate, submission);
//router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);

module.exports = router;