const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error("Google account has no email"),
              null
            );
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              password: "GOOGLE_AUTH_USER",
              role: "tenant",
              googleId: profile.id,
              isVerified: true,
              profilePic: profile.photos?.[0]?.value || "",
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;

            if (!user.profilePic) {
              user.profilePic =
                profile.photos?.[0]?.value || "";
            }

            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  console.log("✅ Google OAuth configured");
} else {
  console.log(
    "⚠️ Google OAuth disabled - missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or GOOGLE_CALLBACK_URL"
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;