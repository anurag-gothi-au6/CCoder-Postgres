//const Challenge = require("../models/Challenge");
const {Challenge} = require("../models/Challenge");
const TestCase = require("../models/TestCase");
const Discussion = require("../models/Discussion");
const Contest = require("../models/Contest");
const Submission = require("../models/Submission");
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
            const user = req.user
            const { name, description, question, output, editorial, maxScore, func_name, no_of_args } = req.body;
            const func_py = funct_py(func_name, no_of_args)
            const func_node = funct_node(func_name, no_of_args)
            const func_java = 'not defined'
            const func_c = 'not defined'
            const func_cpp = 'not defined'
            if (user === undefined) {
                const challenge = await Challenge.create({ name, description, question, output, editorial, maxScore, func_name, no_of_args, func_py, func_node, func_java, func_c, func_cpp });
                res.status(201).json({ status: 201, challenge: challenge });
            }
            else {
                const challenge = await Challenge.create({ name, description, question, output, editorial, maxScore, createdBy: user.id, func_name, no_of_args, func_py, func_node, func_java, func_c, func_cpp });
                res.status(201).json({ status: 201, challenge: challenge, createdBy: user._id });
            }


        } catch (err) {
            console.log(err.message);
            if (err.message === 'Mongo Error') {
                res.status(400).send("Problem Name Should be Different");
            } else {
                res.status(500).send("Server Error");
            }
        }
    },
    async testCase(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.findOne({ where: {name: challengename} })
            let { result, input } = req.body
            let func = challenge.dataValues.func_name
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
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge: challenge.dataValues.id });
            }
            else {
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge: challenge.dataValues.id });
            }
            
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
    },

    async submission(req, res) {
        try {
            const user = req.user;
            const { language, code } = req.body
            console.log(language)
            const challengename = req.params.challenge
            let challenge = await  Challenge.findOne({ where: {name: challengename} });
            let testCases = await  TestCase.findAll({ where: {challenge: challenge.dataValues.id } })
            //console.log(challenge)
            //console.log(testCases[0].dataValues.input)
           // console.log( testCases[0].dataValues.result)
            const maxScore = challenge.dataValues.maxScore
            let score = 0;
            let scorepertc = maxScore / testCases.length


            if (language == 'python') {
                for (i = 0; i < testCases.length; i++) {
                    const input = '\n' + testCases[i].dataValues.input
                    const newcode = code + input
                    const result = await python.runSource(newcode);
                    if (code.includes('\n') == false) {
                        result.stdout = result.stdout.replace('\n', '')
                    }
                    else if (code.includes('\n')) {
                        result.stdout = result.stdout.slice(0, -1)
                    }
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score, submission: submission })
            }
            
            else if (language == 'node') {
                for (i = 0; i < testCases.length; i++) {
                    const input = '\n' + testCases[i].dataValues.input
                    const newcode = code + input

                    const result = await node.runSource(newcode);
                    if (code.includes('\n') == false) {
                        result.stdout = result.stdout.replace(/\n/g, '')
                    }
                    else if (code.includes('\n')) {
                        result.stdout = result.stdout.slice(0, -1)
                    }

                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score,submission: submission })
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    }
}