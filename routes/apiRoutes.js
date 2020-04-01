const { Router } = require("express");
const router = Router();
const {challenge, testCase,challengeDiscussion,contest,submission,getChallenge,contestChallenge,challengeLeaderboard} = require("../controllers/apiController")
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

router.post("/submit/:challenge/:token",authenticate, submission);
router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);

router.get("/:challenge/leaderboard/:token", authenticate, challengeLeaderboard);

router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/contest/new/:token",authenticate, contest);
router.get("/contests/:token", authenticate, getChallenge);
router.post("/contest/:contest/:challenge/:token", authenticate, contestChallenge);

module.exports = router;