"use client"

import { useState } from "react"
import { Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

import { EmployerCredentialsForm } from "@/components/employer/employer-register/EmployerCredentialsForm"
import { EmployerUserInfoForm } from "@/components/employer/employer-register/EmployerUserInfoForm"
import { EmployerCompanyInfoForm } from "@/components/employer/employer-register/EmployerCompanyInfoForm"
import { apiFetch } from "@/lib/api"

export default function EmployerRegisterPage() {
  const router = useRouter()

  // Step progression
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Store all step data
  const [step1, setStep1] = useState<any>(null)
  const [step2, setStep2] = useState<any>(null)
  const [step3, setStep3] = useState<any>(null)

  // Messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">

        {/* Global error (final /register call) */}
        {registerError && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 text-center font-medium rounded">
            {registerError}
          </div>
        )}

        {/* Global success (final /register call) */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 text-center font-medium rounded">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* STEP 1 — Credentials */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT FORM */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <EmployerCredentialsForm
                  onSuccess={(data) => {
                    setStep1(data)
                    setRegisterError(null)
                    setSuccessMessage(null)
                    setStep(2)
                  }}
                />
              </div>

              {/* RIGHT INFO COLUMN */}
              <div className="bg-background-dark text-white p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-background-darker/70 text-sm font-medium mb-4">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Registrierung für Arbeitgeber
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                    Erstellen Sie ein kostenloses Arbeitgeberprofil in nur 3 Schritten
                  </h2>

                  <ol className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-primary text-text-primary font-bold">
                        1
                      </span>
                      <p>Erstellen Sie Ihre Anmeldedaten.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-primary text-text-primary font-bold">
                        2
                      </span>
                      <p>Vervollständigen Sie Ihre persönlichen Daten.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-primary text-text-primary font-bold">
                        3
                      </span>
                      <p>Vervollständigen Sie Ihr Unternehmensprofil.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — User Info */}
          {step === 2 && (
            <div className="p-8 lg:p-12 flex justify-center">
              <div className="w-full max-w-3xl">
                <EmployerUserInfoForm
                  onCancel={() => setStep(1)}
                  onSuccess={(data) => {
                    setStep2(data)
                    setRegisterError(null)
                    setSuccessMessage(null)
                    setStep(3)
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Company Info */}
          {step === 3 && (
            <div className="p-8 lg:p-12 flex justify-center">
              <div className="w-full max-w-3xl">
                <EmployerCompanyInfoForm
                  onBack={() => setStep(2)}
                  onSuccess={async (companyData) => {
                    setStep3(companyData)
                    setRegisterError(null)
                    setSuccessMessage(null)

                    // Safety: ensure previous steps exist
                    if (!step1 || !step2) {
                      setRegisterError(
                        "Something went wrong with your registration steps. Please start again."
                      )
                      setStep(1)
                      return
                    }

                    // Build final payload for /register API
                    const finalPayload = {
                      name: step2.name,
                      username: step1.username,
                      email: step1.email,
                      password: step1.password,
                      salutation: step2.salutation,
                      phone_number: step2.phone_number,
                      position: step2.position,
                      organization: {
                        title: companyData.title,
                        address: companyData.address,
                        postal_code: companyData.postal_code,
                        area: companyData.area,
                        country: companyData.country,
                        size: companyData.size,
                      },
                    }

                    //console.log("🔥 Final register payload:", finalPayload)

                    try {
                      const response = await apiFetch("/register", {
                        method: "POST",
                        body: JSON.stringify(finalPayload),
                      })

                      //console.log("🎉 REGISTER SUCCESS:", response)

                      setSuccessMessage(
                        "Registration successful! Redirecting to login..."
                      )
                      setRegisterError(null)

                      setTimeout(() => {
                        router.push("/employer/login")
                      }, 2000)
                    } catch (err: any) {
                      console.error("❌ REGISTER FAILED:", err)

                      let message =
                        "Something went wrong while creating your account. Please check your data and try again."

                      // Try to pull a nice message from backend
                      if (err?.body?.message && typeof err.body.message === "string") {
                        message = err.body.message
                      } else if (typeof err?.message === "string") {
                        try {
                          const parsed = JSON.parse(err.message)
                          if (parsed?.message && typeof parsed.message === "string") {
                            message = parsed.message
                          } else {
                            message = err.message
                          }
                        } catch {
                          message = err.message
                        }
                      }

                      setRegisterError(message)
                      setSuccessMessage(null)
                    }
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
