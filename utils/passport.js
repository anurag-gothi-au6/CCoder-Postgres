const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../models/User");

//Google Strategy
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const googleOptions = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:1234/google/redirect`
};

passport.use(
  new GoogleStrategy(
    googleOptions,
    async (accessToken, refreshToken, googleProfile, done) => {
      try {
        const {
          _json: { email, name }
        } = googleProfile;
        const user1 = email.split("@");
        const username = user1[0]
        // Ask whether the user is present or not.
        let user = await User.findOne({
            where: { email : email }
        });
        if (!user)
          user = await User.create({ email, name, username, isThirdPartyUser: true });
        return done(null, user);
      } catch (err) {
        if (err.name === "Error") {
          return done(err);
        }
      }
    }
  )
);

//Github startegy
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const githubOptions = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `http://localhost:1234/github/callback`,
  scope: ['user:email']
};

passport.use(
  new GitHubStrategy(
    githubOptions,
    async (accessToken, refreshToken, githubProfile, done) => {
      try {
        const {
          _json: { name }
        } = githubProfile;
        console.log(githubProfile.emails[0].value)
        const email = githubProfile.emails[0].value
        const username = githubProfile.username
        // Ask whether the user is present or not.
        let user = await User.findOne({
            where: { email : email }
        });
        if (!user)
          user = await User.create({ email, name, username,isThirdPartyUser: true });
        return done(null, user);
      } catch (err) {
        if (err.name === "Error") {
          return done(err);
        }
      }
    }
  )
);