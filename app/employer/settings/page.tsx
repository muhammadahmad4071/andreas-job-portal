"use client"

import { FormEvent, useState } from "react"
import { EmployerHeader } from "@/components/employer/employer-home/EmployerHeader"
import { EmployerFooter } from "@/components/employer/employer-home/EmployerFooter"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

// ---- small helper to call backend PATCH endpoints ----

async function apiPatch(path: string, body: unknown) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  const url = `${base}${path}`

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // some APIs return empty body, that’s ok
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      "Something went wrong while updating your profile."
    throw new Error(message)
  }

  return data
}

type StatusState = { type: "idle" | "success" | "error"; message: string }

// ---- page ----

export default function EmployerSettingsPage() {
  // password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStatus, setPasswordStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // username
  const [username, setUsername] = useState("")
  const [usernameStatus, setUsernameStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  })

  // name
  const [name, setName] = useState("")
  const [nameStatus, setNameStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  })

  // email
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  })

  // handlers

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordStatus({ type: "idle", message: "" })

    if (newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message: "The password must be at least 6 characters.",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      })
      return
    }

    try {
      await apiPatch("/profile/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      setPasswordStatus({
        type: "success",
        message: "Password updated successfully.",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPasswordStatus({
        type: "error",
        message: err?.message ?? "Unable to update password.",
      })
    }
  }

  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setUsernameStatus({ type: "idle", message: "" })

    try {
      await apiPatch("/profile/username", {
        username,
      })
      setUsernameStatus({
        type: "success",
        message: "Username updated successfully.",
      })
    } catch (err: any) {
      setUsernameStatus({
        type: "error",
        message: err?.message ?? "Unable to update username.",
      })
    }
  }

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setNameStatus({ type: "idle", message: "" })

    try {
      await apiPatch("/profile/name", {
        name,
      })
      setNameStatus({
        type: "success",
        message: "Name updated successfully.",
      })
    } catch (err: any) {
      setNameStatus({
        type: "error",
        message: err?.message ?? "Unable to update name.",
      })
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEmailStatus({ type: "idle", message: "" })

    try {
      await apiPatch("/profile/email", {
        email,
      })
      setEmailStatus({
        type: "success",
        message: "Email updated successfully.",
      })
    } catch (err: any) {
      setEmailStatus({
        type: "error",
        message: err?.message ?? "Unable to update email.",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* HEADER (same as employer) */}
      <EmployerHeader />

      <main className="flex-1">
        <div className="container-custom max-w-3xl mx-auto py-10 space-y-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile information and login credentials.
            </p>
          </header>

          {/* Update Password */}
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>
                Change the password you use to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Confirm new password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {passwordStatus.type !== "idle" && (
                  <p
                    className={
                      passwordStatus.type === "success"
                        ? "text-sm text-emerald-600"
                        : "text-sm text-red-600"
                    }
                  >
                    {passwordStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                >
                  Save password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Update Username */}
          <Card>
            <CardHeader>
              <CardTitle>Update Username</CardTitle>
              <CardDescription>
                Change the username displayed within the employer area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleUsernameSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="username">New username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {usernameStatus.type !== "idle" && (
                  <p
                    className={
                      usernameStatus.type === "success"
                        ? "text-sm text-emerald-600"
                        : "text-sm text-red-600"
                    }
                  >
                    {usernameStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                >
                  Save username
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Update Name */}
          <Card>
            <CardHeader>
              <CardTitle>Update Name</CardTitle>
              <CardDescription>
                Change the name associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleNameSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {nameStatus.type !== "idle" && (
                  <p
                    className={
                      nameStatus.type === "success"
                        ? "text-sm text-emerald-600"
                        : "text-sm text-red-600"
                    }
                  >
                    {nameStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                >
                  Save name
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Update Email */}
          <Card>
            <CardHeader>
              <CardTitle>Update Email</CardTitle>
              <CardDescription>
                Change the email address linked to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">New email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {emailStatus.type !== "idle" && (
                  <p
                    className={
                      emailStatus.type === "success"
                        ? "text-sm text-emerald-600"
                        : "text-sm text-red-600"
                    }
                  >
                    {emailStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                >
                  Save email
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <EmployerFooter />
    </div>
  )
}
