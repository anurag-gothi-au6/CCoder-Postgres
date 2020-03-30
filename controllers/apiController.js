const Challenge = require("../models/Challenge");
const TestCase = require("../models/TestCase");
const Discussion = require("../models/Discussion");
const Contest = require("../models/Contest");

const { validationResult}=require("express-validator")


const { c, cpp, java, node, python} = require("compile-run");


module.exports = {
    async challenge(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        try {
            const funct_node = (name, no_of_args) => {
                const func = `
        # Complete the ${name} function below.
        #You dont need to provide value in arguement it will be given by compiler
        function ${name}('use ${no_of_args} args here'){
            return
        }`
                return func
            }
            const funct_py = (name, no_of_args) => {
                const func =
                    `#!/bin/python3
        import math
        import os
        import random
        import re
        import sys
        # Complete the ${name} function below.
        #You dont need to provide value in arguement it will be given by compiler
        def ${name}('use ${no_of_args} args here'):
            return
        `
                return func
            }
            const { name, description, question, output, editorial, maxScore, func_name, no_of_args } = req.body;
            console.log(req.body)
            const func_py = funct_py(func_name, no_of_args)
            const func_node = funct_node(func_name, no_of_args)
            const func_java = 'not defined'
            const func_c = 'not defined'
            const func_cpp = 'not defined'

            const challenge = await Challenge.create({ name, description, question, output, editorial, maxScore, func_name, no_of_args, func_py, func_node, func_java, func_c, func_cpp });

            res.status(201).json({status: 201, challenge: challenge});
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    },
    async testCase(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.findOne({
                where: {
                  name:challengename
                }
              });
            const challengeId = challenge.id
            let { result, input } = req.body
            let func = challenge.func_name
            input = input.split(",")
            let newinput = [];
            for (i = 0; i < input.length; i++) {
                if (isNaN(input[i]) == false) {
                    newinput.push(parseInt(input[i]))
                }
                else if (typeof (input[i]) == 'string') {
                    newinput.push(`"${input[i]}"`)
                }
                else {
                    newinput.push(input[i])
                }
            }
            let testCase = 0
            if (typeof (input) == 'string') {
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge:challengeId });
            }
            else {
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge:challengeId });
            }

            // challenge[0].testCases.push(testCase)
            // await challenge[0].save()
            res.status(201).json({ statuscode: 201, testCase: testCase })
        }

        catch (err) {
            console.log(err)
            res.status(500).send("Server Error");
        }
    },
    async challengeDiscussion(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.findOne({
                where: {
                  name:challengename
                }
              });
            const user = req.user;
            const { reply } = req.body;
            if (!reply) return res.status(400).json({ statusCode: 400, message: 'Bad Request' });

            const createDiscussion = await Discussion.create({ reply:reply,challenge:challenge.id, user: user.id });

            res.status(201).json({ statusCode: 201, createDiscussion });
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }
    },
    async contest(req, res) {
        try {
            const details = req.body
            const user = req.user
            details.organizedBy = user.id
            const contest = await Contest.create(details)
            res.json({ contest: contest })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error')
        }
    }
}