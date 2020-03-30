const Challenge = require("../models/Challenge");
const TestCase = require("../models/TestCase");

const { c, cpp, java, node, python} = require("compile-run");


module.exports = {
    async challenge(req, res) {
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
            let challenge = await Challenge.find({ name: challengename })
            let { result, input } = req.body
            let func = challenge[0].func_name
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
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge: challenge[0]._id });
            }
            else {
                testCase = await TestCase.create({ result, input: `${func}(${newinput})`, challenge: challenge[0]._id });
            }

            challenge[0].testCases.push(testCase)
            await challenge[0].save()
            res.status(201).json({ statuscode: 201, testCase: testCase })
        }

        catch (err) {
            console.log(err)
            res.status(500).send("Server Error");
        }
    }
}