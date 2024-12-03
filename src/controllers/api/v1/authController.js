import { User } from '../../../models/index.js'
import jwt from 'jsonwebtoken'

const ALLOWED_AUTH_FIELDS = ['firstName', 'lastName', 'email', 'password', 'gender']

const sanitizeFields = (params) => {
    const sanitizedData = {};
    for (const field of ALLOWED_AUTH_FIELDS) {
        if (params[field] !== undefined) {
            sanitizedData[field] = params[field]
        }
    }
    return sanitizedData
}

export const register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' })
        }

        const user = new User(sanitizeFields(req.body))
        await user.save()

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account',
        })
    } catch (error) { res.status(500).json({ message: 'Server error' }) }
}

export const invite = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' })
        }

        const user = new User(sanitizeFields(req.body))
        user.invitedBy = req.current_user._id
        await user.save()

        res.status(201).json({ message: 'User has been invited successfully.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyInvite = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            invitationToken: token,
            invitationTokenExpiration: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' })
        }

        await user.activateUser()

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verify = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiration: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' })
        }

        await user.activateUser()

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user || user.deletedAt) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Please verify your email to log in' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ message: 'Login successful', token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const logout = async (req, res) => {
    req.current_user = null
    try {
        res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
    
        user.generateVerificationToken()
        global.job.runLater('mailertQueue', 'mailerWorker', 'ForgotPassword', { userId: user._id })
    
        res.status(200).json({ message: 'Check your mail to reset your password.'})
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
    
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiration: { $gt: Date.now() },
        })
    
        await Object.assign(user, { password: process.env.DEFAULT_PASSWORD, verificationToken: null, verificationTokenExpiration: null }).save()
    
        res.status(200).json({ message: 'Your password has been reset.' })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const getUserProfile = (req, res) => {
    const user = req.current_user
    res.status(200).json({ message: 'User profile', user })
}