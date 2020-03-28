const { Router } = require("express");
const router = Router()
const {testCase,submission,challengeDiscussion, challenge,contest,signup,addBookmark, getChallenge, contestChallenge,contestModerator,updateUserChallenge,deleteBookmark,challengeLeaderboard} = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');
const { check} = require("express-validator")


//challenge creation by admin
router.post("/admin/challenge",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores')
], challenge);
router.post("/testcase/:challenge", testCase);
router.post("/submit/:challenge/:token",authenticate, submission);
router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);
router.post("/contest/new/:token",authenticate, contest);
router.post("/contest/:contest/signup/:token",authenticate, signup);
router.post("/contest/:contest/:challenge/:token", authenticate, contestChallenge);
router.post("/contest/:contest/addmoderator/:username/:token",authenticate, contestModerator);
router.get("/:challenge/leaderboard/:token", authenticate, challengeLeaderboard);

router.post("/:challenge/bookmark/add/:token",authenticate, addBookmark);

router.patch("/:challenge/update/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , updateUserChallenge);

router.get("/contest/:token", authenticate, getChallenge);

router.delete("/:challenge/bookmark/delete/:token",authenticate,deleteBookmark)

module.exports = router;
