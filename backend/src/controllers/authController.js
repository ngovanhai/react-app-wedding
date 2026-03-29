// controllers/authController.js
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}


/**
 * Generate JWT token for user
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email đã được sử dụng' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, plan: true, createdAt: true },
    })

    const token = signToken(user.id)
    res.cookie('token', token, COOKIE_OPTIONS)

    res.status(201).json({
      data: { user, token },
      message: 'Đăng ký thành công',
    })
  } catch (error) {
    console.error('[Auth] register error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true, plan: true, avatar: true },
    })

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
    }

    const token = signToken(user.id)
    res.cookie('token', token, COOKIE_OPTIONS)

    // Remove password from response
    const { password: _, ...safeUser } = user

    res.json({
      data: { user: safeUser, token },
      message: 'Đăng nhập thành công',
    })
  } catch (error) {
    console.error('[Auth] login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        planExpiry: true,
        createdAt: true,
        _count: { select: { invitations: true } },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ data: user })
  } catch (error) {
    console.error('[Auth] getMe error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Đã đăng xuất' })
}

module.exports = { register, login, getMe, logout }