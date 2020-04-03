//const Challenge = require("../models/Challenge");
const {Challenge} = require("../models/Challenge");
const TestCase = require("../models/TestCase");
const Discussion = require("../models/Discussion");
const Contest = require("../models/Contest");
const Submission = require("../models/Submission");
const { validationResult}=require("express-validator")
const Sequelize = require("sequelize");
const User = require('../models/User');


const { c, cpp, java, node, python} = require("compile-run");


module.exports = {

    //@access: private;
    //@desc: Creating user defined challenge
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
#Complete the ${name} function below.
#You dont need to provide value in arguement it will be given by compiler
def ${name}('use ${no_of_args} args here'):
    return
`
return func
            }
const funct_c = (no_of_args,input,output)=>{
  const func = `#include<stdio.h>
/**
* Complete this method
* I will be sending ${no_of_args} input
* sample ${input} so use symbol in scanf according to the sample.
* Sample output should be like this ${output} 
*/
void main()
{    
  
    scanf("");
    printf("",result);
    return 0;
}`
  return func
}
const funct_cpp = (no_of_args,input,output)=>{
    const func = `#include <iostream>
using namespace std;
// Complete this method
// I will be sending ${no_of_args} arguements as input
// sample input :${input}
// Sample output: ${output} 

int main()
{
    int a, b;
    // All the required Input Should be taken in single Statement
    cin >> b >> a;
    sumOfTwoNumbers = firstNumber + secondNumber;
    // Only One Print Statement Should be used
    cout << ;     

    return 0;
}`
    return func
  }
  const funct_java = (no_of_args,input,output)=>{
    const func = `import java.util.*;
public class Solution {
    // Complete this method
    // I will be sending ${no_of_args} input so use ${no_of_args} inputs
    // sample input: ${input} .
    // Sample output : ${output} 
    public static void main(String[] args) {
      Scanner sc=new Scanner(System.in);
      
      System.out.println();
    }
}`
    return func
  }
            const user = req.user
            const { name, description, question, output, editorial, maxScore, func_name, no_of_args } = req.body;
            const func_py = funct_py(func_name, no_of_args)
            const func_node = funct_node(func_name, no_of_args)
            const func_java = funct_java(no_of_args,input,output)
            const func_c = funct_c(no_of_args,input,output)
            const func_cpp = funct_cpp(no_of_args,input,output)
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
            }
            else if(err.code==11000){
                res.status(422).send("bad request")
            }
             else {
                res.status(500).send("Server Error");
            }
        }
    },

    //@access:private
    //@desc : For Adding Test case for challenge
    async testCase(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.findOne({ where: {name: challengename} })
            if (challenge.length == 0) {
                throw new Error('Invalid Challenge')
            }
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
                testCase = await TestCase.create({ rawinput:`${newinput}`,result, input: `${func}(${newinput})`, challenge: challenge.dataValues.id });
            }
            else {
                testCase = await TestCase.create({ rawinput:`${newinput}`,result, input: `${func}(${newinput})`, challenge: challenge.dataValues.id });
            }
            
            res.status(201).json({ statuscode: 201, testCase: testCase })
        }

        catch (err) {
            console.log(err)
            if (err.message == 'Invalid Challenge') {
                res.status(403).send(err.message)
            }
            else {
                res.status(500).send('Server Error');
            }
        }
    },

    //@desc:For Replying on the discussion Section of a challenge
    //@access:PRIVATE       
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

    //@desc:FOR ORGANIZING A CONTEST
    //@access:PRIVATE
    async contest(req, res) {
        try {
            const details = req.body
            const user = req.user
            details.organizedBy = user.id
            const contest = await Contest.create(details)
            res.json({ contest: contest })
        }
        catch (err) {
            console.log(err)
            if (err.code == 11000) {
                res.status(409).send("Duplicate Values")
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:For Compiling and submitting code for a challenge
    //@access:PRIVATE
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
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: Math.round(score), challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score, submission: submission })
            }
            
            else if (language == 'node') {
                for (i = 0; i < testCases.length; i++) {
                    const input = '\n' + testCases[i].dataValues.input
                    const newcode = code + input
                    const result = await node.runSource(newcode);
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: Math.round(score), challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score,submission: submission })
            }
            else if (language == 'c') {
                for (i = 0; i < testCases.length; i++) {
                    let input = testCases[i].dataValues.input
                    input = input.replace(',','\n')
                    const result = await c.runSource(code,{stdin:input});
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: Math.round(score), challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score,submission: submission })
            }
            else if (language == 'c++') {
                for (i = 0; i < testCases.length; i++) {
                    let input = testCases[i].dataValues.input
                    input = input.replace(',','\n')
                    const result = await cpp.runSource(code,{stdin:input});
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: Math.round(score), challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score,submission: submission })
            }
            else if (language == 'java') {
                for (i = 0; i < testCases.length; i++) {
                    let input = testCases[i].dataValues.input
                    input = input.replace(',','\n')
                    const result = await java.runSource(code,{stdin:input});
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == testCases[i].dataValues.result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: Math.round(score), challenge: challenge.dataValues.id, user: user.id, language: language });
                res.json({ score: score,submission: submission })
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    //@desc:For Displaying All the challenge available for a user.
    //@access:Private
    async getChallenge(req, res) {
        try {
            const user = req.user
            const challenges = await Challenge.findAll({
                where: Sequelize.and(
                  { contest: null },
                  Sequelize.or(
                    { createdBy: null },
                    { createdBy: user.id }
                  )
                )
             })
             
        res.json({ challenges: challenges })
        } 
        catch (err) {
            console.log(err);
            res.send('Server Error')
        }
    },

    //@desc:Adding challenge in the Contest
    //@access:Private 
    async contestChallenge(req, res) {
        try {
            const user = req.user;
            const contestName = req.params.contest;
            const challengeName = req.params.challenge;
            const contest = await Contest.findOne({
                where: {
                  name:contestName
                }
              });
            let challenge = await Challenge.findOne({
                where: {
                  name:challengeName
                }
              });
              let testcase = await TestCase.findOne({
                where: {
                  challenge:challenge.id
                }
              });
            challenge.dataValues.contest = contest.id
            challenge.dataValues.name+='-'+contest.name
            challenge.dataValues.id = null
            console.log(challenge.dataValues)
            const challengeCreation = await Challenge.create(challenge.dataValues)
            testcase.dataValues.id=null
            testcase.dataValues.challenge = challengeCreation.id
            const testcaseCreation = await TestCase.create(testcase.dataValues)

            res.json({ challenge: challengeCreation,testcase:testcaseCreation })
        } catch (err) {
            console.log(err);
            res.send('Server Error')
        }
    },

    //@desc:FOR CHECKING THE LEADERBOARD OF A CHALLENGE
    //@access:PUBLIC
    async challengeLeaderboard(req, res) {
        try {
            const challengename = req.params.challenge
            const challenge = await Challenge.findOne({
                
                where: {
                  name:challengename
                }
              });            
            let submission = await Submission.findAll({
                where:{
                    challenge:challenge.id
                },
                order:[
                    ['score','DESC']
            ]
                })
            let users = await User.findAll({})
            const userss = users.map(el=>{
                return {username:el.username,id:el.id}
            })

            let submissions = submission.map(el => {
                const user = el.user
                let newuser;
                for(i=0;i<userss.length;i++){
                    if(userss[i].id==user){
                        newuser=userss[i].username
                        break
                    } 
                    else{
                        continue
                    }
                }
                const score = el.score
                return { user: newuser, score: score, language: el.language }
            })
            var sub = {};
            var newSubmission = submissions.filter(function (entry) {
                if (sub[entry.user]) {
                    return false;
                }
                sub[entry.user] = true;
                return true;
            });

            res.json({ sub: newSubmission })
        } 
        catch (err) {
            console.log(err.message)
            res.status(501).send("Server Error");
        }
    }
}