"use client"

import useAuthStore from "@/app/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { PlusCircle, Building2, ChevronRight, Trash, Layers, Loader2, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

interface Company {
  id: string
  companyName: string
}

interface DashboardDetails {
  totalCompanies: number
  totalRounds: number
}

function Dashboard() {
  const [companyName, setCompanyName] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails>({
    totalCompanies: 0,
    totalRounds: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const { user } = useAuthStore()
  const session = useSession()
  const userId = session.data?.user.id
  const router = useRouter()

  useEffect(() => {
    if (!userId) return

    const fetchAllData = async () => {
      setIsLoading(true)
      try {
        // Fetch companies
        const companiesResponse = await fetch(`${backendUrl}/company/fetch-companies?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
          credentials: "include"
        })

        if (companiesResponse.status === 429) {
          toast.error("Rate limit exceeded. Please try again in 1 minute.", {
            duration: 5000,
            icon: <AlertTriangle className="text-amber-500" />,
          })
          setIsRateLimited(true)
          setCompanies([])
        } else if (!companiesResponse.ok) {
          throw new Error("Failed to fetch companies")
        } else {
          const companiesData = await companiesResponse.json()
          setCompanies(companiesData.companies || [])
        }

        // Fetch dashboard details
        const dashboardResponse = await fetch(`${backendUrl}/company/get-dashboard-details?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
          credentials: "include"
        })

        if (dashboardResponse.status === 429) {
          toast.error("Rate limit exceeded for dashboard data. Please try again in 1 minute.", {
            duration: 5000,
            icon: <AlertTriangle className="text-amber-500" />,
          })
          setIsRateLimited(true)
          setDashboardDetails({
            totalCompanies: 0,
            totalRounds: 0,
          })
        } else if (!dashboardResponse.ok) {
          throw new Error("Failed to fetch dashboard details")
        } else {
          const dashboardData = await dashboardResponse.json()
          setDashboardDetails(dashboardData.dashboardDetails)
        }
      } catch (error: any) {
        console.error(error.message)
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [userId, backendUrl])

  const handleAddCompany = async () => {
    if (!companyName.trim()) return toast.error("Company name cannot be empty!")

    const toastId = toast.loading("Adding company...")
    try {
      const response = await fetch(`${backendUrl}/company/create-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, companyName }),
      })

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again in 1 minute.", { id: toastId })
        return
      }

      if (!response.ok) throw new Error("Failed to create company")

      const newCompany = await response.json()
      setCompanies((prev) => [...prev, newCompany])
      setDashboardDetails((prev) => ({
        ...prev,
        totalCompanies: prev.totalCompanies + 1,
      }))
      setCompanyName("")
      setIsDialogOpen(false)
      toast.success("Company added successfully", { id: toastId })
      setTimeout(() => {
        window.location.reload();
      },2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to add company", { id: toastId })
    }
  }

  const openDeleteConfirmation = (companyId: string) => {
    setCompanyToDelete(companyId)
    setIsConfirmDeleteOpen(true)
  }

  const handleDeleteCompany = async () => {
    if (!companyToDelete || !userId) return

    const toastId = toast.loading("Deleting company...")
    try {
      const response = await fetch(`${backendUrl}/company/delete-company`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ userId, companyId: companyToDelete }),
      })

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again in 1 minute.", { id: toastId })
        setIsConfirmDeleteOpen(false)
        return
      }

      if (!response.ok) throw new Error("Failed to delete company")

      setCompanies(companies.filter((company) => company.id !== companyToDelete))
      setDashboardDetails((prev) => ({
        ...prev,
        totalCompanies: prev.totalCompanies - 1,
      }))
      setIsConfirmDeleteOpen(false)
      setCompanyToDelete(null)

      toast.success("Company deleted", {
        id: toastId,
      })
    } catch (error: any) {
      toast.error("Failed to delete company", { id: toastId })
    }
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  const handleRetry = () => {
    setIsRateLimited(false)
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 mb-20 lg:mb-0 md:py-8 max-w-6xl lg:min-h-screen">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">
          Good {getTimeOfDay()},{" "}
          <span className="text-[#05FFF8] font-medium">{user?.name?.split(" ")[0] || "there"}</span>!
        </h1>
        <p className="text-lg sm:text-xl text-[#D1D7E0]/80 mb-4">Your interview preparation dashboard</p>
      </div>

      {/* Rate Limit Warning Banner - Only shown when rate limited */}
      {isRateLimited && (
        <div className="mb-6 bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-400">Rate Limit Exceeded</h3>
            <p className="text-[#D1D7E0]/80 text-sm">You've reached the request limit. Please wait a minute before trying again.</p>
          </div>
          <Button 
            onClick={handleRetry} 
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="mb-6 sm:mb-8 md:mb-10 bg-[#1A1040]/50 p-4 sm:p-6 rounded-xl border border-[#9D4EDD]/30">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#05FFF8]">Dashboard Overview</h2>
              <p className="text-sm sm:text-base text-[#D1D7E0]/70">Your interview preparation at a glance</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-[#231651] px-4 sm:px-5 py-3 rounded-lg border border-[#9D4EDD]/30">
                <div className="flex items-center space-x-2">
                  <Building2 size={18} className="text-[#FF2A6D]" />
                  <p className="text-[#D1D7E0]/70 text-sm">Companies</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#FF2A6D]">{dashboardDetails.totalCompanies}</p>
              </div>
              <div className="flex-1 sm:flex-none bg-[#231651] px-4 sm:px-5 py-3 rounded-lg border border-[#9D4EDD]/30">
                <div className="flex items-center space-x-2">
                  <Layers size={18} className="text-[#05FFF8]" />
                  <p className="text-[#D1D7E0]/70 text-sm">Interview Rounds</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#05FFF8]">{dashboardDetails.totalRounds}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Company Section */}
      <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white px-4 sm:px-6 py-4 sm:py-6 rounded-lg shadow-lg hover:shadow-[#FF2A6D]/20 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg font-medium cursor-pointer">
              <PlusCircle className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
              Create New Company
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#231651] border border-[#9D4EDD] text-[#D1D7E0] w-[95%] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#05FFF8] text-xl sm:text-2xl">Create a New Company</DialogTitle>
              <DialogDescription className="text-[#D1D7E0]/70 text-sm sm:text-base">
                Add a company to organize your interview preparation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-[#D1D7E0]">Company Name</Label>
                <Input
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-2 bg-[#1A1040] border-[#9D4EDD]/50 text-[#D1D7E0] focus:border-[#05FFF8] focus:ring-[#05FFF8]/20"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleAddCompany}
                  className="bg-[#ff2a6d] hover:bg-[#d12564] text-white font-medium cursor-pointer"
                >
                  Add Company
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="bg-[#231651] border border-[#9D4EDD] text-[#D1D7E0] w-[95%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#FF2A6D] text-xl sm:text-2xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-[#D1D7E0]/70 text-sm sm:text-base">
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="bg-[#1A1040] hover:bg-[#1A1040]/80 text-[#D1D7E0] cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteCompany} className="bg-[#ff2a6d] hover:bg-[#d12564] text-white cursor-pointer">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Display Companies */}
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#05FFF8] pl-2 border-l-4 border-[#FF2A6D]">
            Your Companies
          </h2>
          {companies.length > 0 && (
            <div className="text-sm sm:text-base text-[#D1D7E0]/70">
              <span className="text-[#05FFF8] font-medium">{companies.length}</span>{" "}
              {companies.length === 1 ? "company" : "companies"} found
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center p-6 sm:p-12 border border-dashed border-[#9D4EDD]/30 rounded-xl bg-[#1A1040]/50">
            <div className="text-[#D1D7E0]/60">
              <Loader2 className="mx-auto mb-3 opacity-50 animate-spin w-8 sm:w-10 h-8 sm:h-10" />
              <p className="text-base sm:text-lg">Loading companies...</p>
            </div>
          </div>
        ) : isRateLimited ? (
          <div className="text-center p-6 sm:p-12 border border-dashed border-[#9D4EDD]/30 rounded-xl bg-[#1A1040]/50">
            <div className="text-[#D1D7E0]/60">
              <AlertTriangle className="mx-auto mb-3 opacity-50 w-8 sm:w-10 h-8 sm:h-10 text-amber-500" />
              <p className="text-base sm:text-lg mb-4">Rate limit exceeded. Please try again in 1 minute.</p>
              <Button onClick={handleRetry} className="bg-amber-600 hover:bg-amber-700 text-white">
                Retry Now
              </Button>
            </div>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid gap-4">
            {companies.map((company, index) => (
              <div
                key={company.id || index}
                className="p-4 sm:p-5 border border-[#9D4EDD]/30 rounded-xl bg-gradient-to-r from-[#1A1040] to-[#231651] hover:from-[#231651] hover:to-[#1A1040] shadow-lg hover:shadow-[#9D4EDD]/20 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 group"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-2 bg-[#9D4EDD]/20 rounded-full text-[#05FFF8]">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-white">{company.companyName}</h3>
                    <p className="text-xs sm:text-sm text-[#D1D7E0]/60">
                      ID: {company.id ? company.id.substring(0, 8) : "N/A"}...
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button
                    className="flex-1 sm:flex-none bg-[#05FFF8] hover:bg-[#05FFF8]/80 text-[#1A1040] font-medium px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center justify-center gap-1 group-hover:gap-2 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/dashboard/rounds?companyId=${company.id}`)}
                  >
                    Open{" "}
                    <ChevronRight size={14} className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>

                  <Button
                    className="flex-1 sm:flex-none bg-[#ff2a6d] hover:bg-[#d12564] text-white font-medium px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => openDeleteConfirmation(company.id)}
                  >
                    Delete <Trash className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 sm:p-12 border border-dashed border-[#9D4EDD]/30 rounded-xl bg-[#1A1040]/50">
            <div className="text-[#D1D7E0]/60 mb-3">
              <Building2 size={32} className="mx-auto mb-3 opacity-50 sm:w-10 sm:h-10" />
              <p className="text-base sm:text-lg">No companies found. Create one to get started!</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF2A6D]/80 hover:bg-[#FF2A6D] text-white mt-3 w-full sm:w-auto">
                  <PlusCircle size={16} className="mr-2" />
                  Create Your First Company
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard