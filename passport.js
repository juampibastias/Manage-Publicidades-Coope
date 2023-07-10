const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const usuariosModel = require("./models/usuariosModel");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "572686999881-qdpbbai10qqv3iopfp2h1uri12mi640t.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await usuariosModel.getUserByGoogleId(profile.id);

        if (user) {
          return done(null, user);
        } else {
          const newUser = {
            googleId: profile.id,
            // Otros datos del usuario según tus necesidades
          };
          await usuariosModel.createUser(newUser);
          return done(null, newUser);
        }
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serializa el ID del usuario
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usuariosModel.getUserById(id);
    done(null, user); // Deserializa el usuario encontrado por su ID
  } catch (error) {
    done(error, null);
  }
});


module.exports = passport;
