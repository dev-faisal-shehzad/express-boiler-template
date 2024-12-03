import express from 'express'
const v1Router = express.Router()

const skipAuth = (req, res, next) => {
    req.skipAuth = true
    return next()
}

v1Router.post('/register', skipAuth, register)
v1Router.post('/login', skipAuth, login)
v1Router.get('/verify-email/:token', skipAuth, verifyEmail)
v1Router.post('/forgot-password', skipAuth, forgotPassword)
v1Router.post('/reset-password/:token', skipAuth, resetPassword)
v1Router.post('/resend-verification', skipAuth, resendVerificationLink)
v1Router.get('/profile', getUserProfile)
v1Router.post('/logout', logout)