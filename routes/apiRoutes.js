const { Router } = require("express");
const router = Router();
const {challenge, testCase,challengeDiscussion,contest,submission,getChallenge,contestChallenge, contestSignup,contestModerator, addBookmark, deleteBookmark, updateChallenge, deleteContestModerator, deleteChallenge, contestUpdate, deleteContest,testCaseUpdate, testCaseDelete} = require("../controllers/apiController")
const authenticate = require('../middlewares/authenticate');
const { check} = require("express-validator")


router.post("/admin/challenge",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores')
], challenge);

router.post("/testcase/:challenge/:token",authenticate,testCase);

router.post("/admin/testcase/:challenge", testCase);

router.patch("/testcase/update/:challenge/:testCaseId/:token", authenticate, testCaseUpdate);

router.patch("/admin/testcase/update/:challenge/:testCaseId", testCaseUpdate);

router.delete("/testcase/delete/:challenge/:testCaseId/:token", authenticate, testCaseDelete);

router.delete("/admin/testcase/delete/:challenge/:testCaseId", testCaseDelete);

router.post("/submit/:challenge/:token",authenticate, submission);

router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);


router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);

router.post("/contest/new/:token",authenticate, contest);

router.get("/contests/:token", authenticate, getChallenge);

router.post("/contest/signup/:contest/:token",authenticate, contestSignup);

router.post("/contest/:contest/addmoderator/:username/:token",authenticate, contestModerator);

router.post("/contest/:contest/:challenge/:token", authenticate, contestChallenge);

router.post("/:challenge/bookmark/add/:token",authenticate, addBookmark);

router.patch("/:challenge/update/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , updateChallenge);

router.delete("/:challenge/bookmark/delete/:token",authenticate,deleteBookmark);

router.patch("/:challenge/adminupdate", updateChallenge)

router.patch("/contest/:contest/update/:token", authenticate, contestUpdate);

router.delete("/contest/delete/:contest/:token", authenticate, deleteContest);

router.delete("/user/delete/:challenge/:token", authenticate, deleteChallenge);

router.delete("/admin/delete/:challenge", deleteChallenge);

router.delete("/contest/:contest/deletemoderator/:username/:token",authenticate,deleteContestModerator);


module.exports = router;