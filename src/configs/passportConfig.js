import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { User } from '../models/index.js'

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from Authorization header
    secretOrKey: process.env.JWT_SECRET,  // Secret key to verify the token
    algorithms: ['HS256'],
};

const jwtStrategy = new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.userId).exec()
        if (!user) {
            return done(null, false)
        }
        if (user.deletedAt) {
            return done(null, false)
        }
        if (!user.isActive) {
            return done(null, false)
        }
        return done(null, user)
    } catch (error) {
        return done(error, false)
    }
})

const initializePassport = (passport) => { passport.use(jwtStrategy) }

export default initializePassport