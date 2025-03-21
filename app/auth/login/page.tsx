"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast.error("Oops! That email or password does not match our records. Try again!")
        setError(result.error)
      } else {
        const response = await fetch("/api/auth/session")
        const sessionData = await response.json()
        router.push("/dashboard")
        toast.success(" Welcome back! Redirecting to your dashboard...");
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        
      }
    } catch (err) {
      toast.error('Something went wrong on our end. Please refresh and try again.')
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
      })


      if (result?.error) {
        toast.error("Google login didn’t work. Try again or use another method!")
        setError("Failed to sign in with Google")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      const result = await signIn("github", {
        callbackUrl: "/",
      })

      if (result?.error) {
        toast.error("GitHub sign-in didn’t work. Double-check your credentials or try again!")
        setError("Failed to sign in with GitHub")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1040] p-4 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute w-64 h-64 bg-[#FF2A6D] opacity-10 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-[#05FFF8] opacity-10 rounded-full blur-3xl -bottom-32 -right-32"></div>
      <div className="absolute w-32 h-32 bg-[#9D4EDD] opacity-10 rounded-full blur-2xl bottom-20 left-20"></div>

      <Card className="w-full max-w-md bg-[#1A1040] text-white border border-[#FF2A6D]/30 rounded-xl shadow-lg shadow-[#FF2A6D]/10 backdrop-blur-sm relative z-10">
        <div className="absolute h-1 w-full bg-gradient-to-r from-[#FF2A6D] via-[#9D4EDD] to-[#05FFF8] top-0 left-0 rounded-t-xl"></div>

        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-2">
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF2A6D] to-[#05FFF8]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-[#D1D7E0]/70">
            Sign in to continue your Interview journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-[#FF9F1C]/20 border border-[#FF9F1C] text-white">
              <AlertCircle className="h-4 w-4 text-[#FF9F1C]" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#D1D7E0] text-sm font-medium flex items-center">
                <span className="inline-block w-1 h-4 bg-[#FF2A6D] mr-2 rounded-sm"></span>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="your.email@example.com"
                className="w-full bg-[#231651] text-white border-[#FF2A6D]/30 focus:border-[#FF2A6D] rounded-md focus:ring-1 focus:ring-[#FF2A6D] placeholder:text-[#D1D7E0]/40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#D1D7E0] text-sm font-medium flex items-center">
                  <span className="inline-block w-1 h-4 bg-[#9D4EDD] mr-2 rounded-sm"></span>
                  Password
                </Label>
                <a href="/auth/forgot-password" className="text-xs text-[#05FFF8] hover:text-[#05FFF8]/90 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="••••••••••••"
                className="w-full bg-[#231651] text-white border-[#9D4EDD]/30 focus:border-[#FF2A6D] rounded-md focus:ring-1 focus:ring-[#FF2A6D]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF2A6D] hover:bg-[#FF2A6D]/90 text-white font-medium py-5 rounded-md relative overflow-hidden group transition-all duration-300"
              disabled={isLoading}
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 opacity-0 group-hover:opacity-100">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF2A6D] via-[#9D4EDD] to-[#05FFF8] bg-size-200 animate-shimmer"></span>
              </span>
              <span className="relative z-10">{isLoading ? "Accessing..." : "Sign In"}</span>
            </Button>
          </form>

          <div className="relative my-6">
            <Separator className="bg-[#D1D7E0]/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#1A1040] px-3 text-[#D1D7E0]/60 text-xs">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full cursor-pointer bg-transparent text-[#D1D7E0] border border-[#D1D7E0]/20 hover:border-[#FF2A6D]/40  rounded-md transition-all font-medium"
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <Button
              onClick={handleGitHubSignIn}
              variant="outline"
              className="w-full cursor-pointer bg-transparent text-[#D1D7E0] border border-[#D1D7E0]/20 hover:border-[#FF2A6D]/40 rounded-md transition-all font-medium"
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-[#D1D7E0]/70">
            New to InterviewBuddy?{" "}
            <a href="/auth/register" className="text-[#05FFF8] hover:text-[#05FFF8]/90 transition-colors font-medium">
              Create an account
            </a>
          </p>
        </CardFooter>

        {/* Decorative futuristic corner elements */}
        <div className="absolute w-4 h-4 top-2 left-2 border-l-2 border-t-2 border-[#05FFF8]/60 opacity-70"></div>
        <div className="absolute w-4 h-4 top-2 right-2 border-r-2 border-t-2 border-[#05FFF8]/60 opacity-70"></div>
        <div className="absolute w-4 h-4 bottom-2 left-2 border-l-2 border-b-2 border-[#05FFF8]/60 opacity-70"></div>
        <div className="absolute w-4 h-4 bottom-2 right-2 border-r-2 border-b-2 border-[#05FFF8]/60 opacity-70"></div>

        {/* Decorative circuit dots */}
        <div className="absolute h-1 w-1 rounded-full bg-[#05FFF8] top-6 left-6 shadow-md shadow-[#05FFF8]/50 animate-pulse"></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#FF2A6D] top-6 right-6 shadow-md shadow-[#FF2A6D]/50 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#05FFF8] bottom-6 left-6 shadow-md shadow-[#05FFF8]/50 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#9D4EDD] bottom-6 right-6 shadow-md shadow-[#9D4EDD]/50 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </Card>
    </div>
  )
}