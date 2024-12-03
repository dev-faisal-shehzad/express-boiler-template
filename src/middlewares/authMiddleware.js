import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const SKIP_AUTH_ROUTES = [
    '/bullmq',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
    '/verify-email/:token',
    '/resend-verification',
]


const authenticateUser = async (req, res, next) => {
  try {
    if (req.path.startsWith('/bullmq') || SKIP_AUTH_ROUTES.some(route => req.path === route)) {
      return next()
    }

    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: 'Invalid or inactive user' })
    }

    req.current_user = user

    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Authentication failed' })
  }
}

export default authenticateUser
