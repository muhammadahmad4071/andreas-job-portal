'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Building2, Mail, CheckCircle2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button' // 👈 match your existing Button file
import Link from "next/link"
export default function EmployerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      alert('Please accept the Terms and Conditions')
      return
    }
    console.log('Register with:', { email, password })
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
    //   <div className="container-custom">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        {/* Main Card Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Registration Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Form Header */}
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
                  CREATE A FREE EMPLOYER PROFILE NOW
                </h1>
                <p className="text-text-secondary text-base">
                  Register your free account and get started right away!
                </p>
                <p className="text-text-secondary text-base">
                  To complete the registration, you will receive a confirmation email.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
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
                    placeholder="Enter your password"
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

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 border border-input rounded-sm text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-text-primary leading-relaxed">
                    By clicking this checkbox and clicking the final &quot;Register&quot; button, you accept the
                    following{' '}
                    <a href="#" className="text-primary font-semibold hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    on behalf of the organization on whose behalf you are gaining access to the Online Platform
                    (&quot;Customer&quot;). (&quot;T&amp;Cs&quot;) of RecruitingNow GmbH, Mangfallstraße 3a, 83703
                    Gmund Bayern, Germany (&quot;Provider&quot;). If you do not agree to these Terms and Conditions
                    or if you are not authorized to represent you, do not check the boxes and cancel the registration
                    process.
                    <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-text-primary font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  Register for free
                </Button>

                {/* Login Link */}
                <div className="text-center pt-2">
                    <span className="text-text-secondary">Already have an account? </span>
                    <Link
                        href="/employer/login"
                        className="text-primary font-semibold hover:underline"
                    >
                        Announce
                    </Link>
                </div>
              </form>
            </div>

            {/* Right Column - Steps Guide */}
            <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center lg:border-l border-border">
              {/* Steps Header */}
              <div className="mb-8">
                <div className="inline-block bg-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
                  Registration for employers
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-8">
                  Create a free employer profile in just 3 steps
                </h2>
              </div>

              {/* Steps List */}
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-text-primary font-bold text-lg">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-2">
                      1) Create your free user account by entering your email address and the desired password.
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-text-primary font-bold text-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-2">
                      2) To verify your information, we will send you an email. By clicking on the confirmation
                      link, you activate your user account.
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-text-primary font-bold text-lg">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-2">
                      3) Complete your free employer profile with more information about your company and
                      attractive pictures! This is how you position yourself as an attractive employer in the
                      region.
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-text-primary font-bold text-lg">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">Post a job - easy and fast!</h3>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-text-primary font-bold text-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">
                      MANAGED! Browse through our popular recruiting products at your leisure and publish your
                      first job ad right away!
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-text-secondary text-sm">
                  Do you have any questions or would you like help?{' '}
                  <a href="#" className="text-primary font-semibold hover:underline">
                    Contact us!
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
