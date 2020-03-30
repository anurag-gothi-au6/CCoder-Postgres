const { Router } = require("express");
const router = Router();
const {challenge, testCase} = require("../controllers/apiController")

router.post("/admin/challenge", challenge);

router.post("/testcase/:challenge",  testCase);

router.post("/user/challenge", challenge);

module.exports = router;