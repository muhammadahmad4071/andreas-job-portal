'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from "next/link"
export default function EmployerLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login with:', { email, password })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Column - Login Form */}
        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="mb-12">
            <Link href="/">
                <img 
                src="/logo.png"
                alt="Oberland JOBS Logo"
                className="h-12 cursor-pointer"
                />
            </Link>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
                Announce
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="E-mail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-text-primary font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Log in
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account yet?{' '}
                <Link
                    href="/employer/register"
                    className="text-primary font-semibold hover:underline"
                >
                    Register now and create a free employer profile!
                </Link>
                </p>
              <p className="text-sm text-text-secondary">
                Forgot your password?{' '}
                <a href="#" className="text-primary font-semibold hover:underline">
                  Reset your password.
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Background Image */}
        <div 
            className="hidden lg:block bg-cover bg-center relative"
            style={{
                backgroundImage: 'url(/login-image.jpg)'   // ← your real image
            }}
            >
            <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>
    </div>
  )
}
