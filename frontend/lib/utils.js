// lib/utils.js
import { clsx } from 'clsx'

/**
 * Merge Tailwind classes with conditional support
 */
export function cn(...inputs) {
  return clsx(inputs)
}

/**
 * Format date to Vietnamese locale
 * Example: "Thứ Sáu, 14 tháng 2, 2025"
 */
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
    ...options,
  }).format(new Date(date))
}

/**
 * Generate a unique URL slug for an invitation
 * Format: [groom-bride]-[6-char-random]
 * Example: "an-binh-k8x2m1"
 */
export function generateSlug(groom, bride) {
  const random = Math.random().toString(36).substring(2, 8)
  const groomSlug = groom.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const brideSlug = bride.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return `${groomSlug}-${brideSlug}-${random}`
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Convert bytes to human-readable size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce a function call
 */
export function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
