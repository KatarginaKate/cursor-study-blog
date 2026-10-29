import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import toast from 'react-hot-toast'
import { blogApi } from '@/api'
import '@/i18n'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

beforeEach(() => {
  vi.spyOn(toast, 'success').mockImplementation(() => {})
  vi.spyOn(toast, 'error').mockImplementation(() => {})
  if (typeof toast.info !== 'function') {
    toast.info = () => {}
  }
  vi.spyOn(toast, 'info').mockImplementation(() => {})
  vi.spyOn(blogApi, 'getAll').mockResolvedValue({ data: { success: true, blogs: [] } })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})
