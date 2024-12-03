import { User } from '../../../models/index.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' })
        }

        const user = new User({ firstName, lastName, email, password })
        await user.save()
        user.generateVerificationToken()

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiration: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' })
        }

        await Object.assign(user, { isActive: true, verificationToken: null, verificationTokenExpiration: null }).save()

        res.json({ message: 'Email verified successfully. You can now log in.' })
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

        const token = user.generateAuthToken()

        res.json({ message: 'Login successful', token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const logout = async (req, res) => {
    try {
        res.json({ message: 'Logout successful' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
}

export const getUserProfile = (req, res) => {
    const user = req.current_user
    res.json({ message: 'User profile', user })
}