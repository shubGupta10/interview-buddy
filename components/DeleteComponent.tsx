"use client"

import { useState } from "react"
import { Trash2, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"

type DeleteComponentProps = {
  companyId: string
  roundId: string
  roundName?: string
  languages?: string[] 
  difficulties?: string[] 
  onDeleteSuccess?: () => void
}

const DeleteComponent = ({
  companyId,
  roundId,
  roundName,
  languages = ["python", "javascript", "java", "PHP", "go"],
  difficulties = ["easy", "medium", "hard"],
  onDeleteSuccess,
}: DeleteComponentProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deleteOption, setDeleteOption] = useState<string>("all") 
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const getDeleteEndpoint = () => {
    switch (deleteOption) {
      case "language":
        return "/question/delete-questions-by-language"
      case "difficulty":
        return "/question/delete-questions-by-difficulty"
      default:
        return "/question/delete-questions-by-roundId"
    }
  }

  const getDeletePayload = () => {
    const payload: Record<string, string> = {
      companyId,
      roundId,
    }

    if (deleteOption === "language" && selectedLanguage) {
      payload.language = selectedLanguage
    } else if (deleteOption === "difficulty" && selectedDifficulty) {
      payload.difficulty = selectedDifficulty
    }

    return payload
  }

  const getDeleteMessage = () => {
    switch (deleteOption) {
      case "language":
        return selectedLanguage ? `Delete ${selectedLanguage} questions` : "Delete by language"
      case "difficulty":
        return selectedDifficulty ? `Delete ${selectedDifficulty} difficulty questions` : "Delete by difficulty"
      default:
        return "Delete all questions"
    }
  }

  const getConfirmationMessage = () => {
    switch (deleteOption) {
      case "language":
        return `Are you sure you want to delete all ${selectedLanguage} questions from ${roundName || "this round"}?`
      case "difficulty":
        return `Are you sure you want to delete all ${selectedDifficulty} difficulty questions from ${roundName || "this round"}?`
      default:
        return `Are you sure you want to delete all questions from ${roundName || "this round"}?`
    }
  }

  const handleDelete = async () => {
    if (deleteOption === "language" && !selectedLanguage) {
      toast.error("Please select a language")
      return
    }
    if (deleteOption === "difficulty" && !selectedDifficulty) {
      toast.error("Please select a difficulty")
      return
    }

    setIsDeleting(true)

    try {
      const endpoint = getDeleteEndpoint()
      const payload = getDeletePayload()

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.status) {
        toast.success(data.message || "Questions deleted successfully")
        setIsOpen(false)
        if (onDeleteSuccess) {
          onDeleteSuccess()
        }
      } else {
        toast.error(data.message || "Failed to delete questions")
      }
    } catch (error) {
      console.error("Error deleting questions:", error)
      toast.error("An error occurred while deleting questions")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    
    window.location.reload()
  }

  const handleOpenDialog = () => {
    setDeleteOption("all")
    setSelectedLanguage("")
    setSelectedDifficulty("")
    setIsOpen(true)
  }

  const isDeleteButtonDisabled = 
    (deleteOption === "language" && !selectedLanguage) || 
    (deleteOption === "difficulty" && !selectedDifficulty)

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={handleOpenDialog}
        className="bg-[#FF2A6D] hover:bg-[#ff2a4a] text-white border border-[#ff2a4a] transition-colors p-5 cursor-pointer"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Questions
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="bg-[#1A1040] hover:bg-[#1A1040]/80 text-[#ffff] hover:text-white cursor-pointer border border-[#05FFF8]/30 transition-colors p-5"
      >
        {isRefreshing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </>
        )}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-[#1A1040] border border-[#9D4EDD]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#05FFF8] flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-[#FF2A6D]" />
              Delete Questions
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#D1D7E0]/80">
              Select what you would like to delete:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 my-2">
            <Select onValueChange={setDeleteOption} value={deleteOption}>
              <SelectTrigger className="w-full bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                <SelectValue placeholder="Select what to delete" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                <SelectGroup>
                  <SelectLabel className="text-[#05FFF8]">Delete Options</SelectLabel>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="language">By Language</SelectItem>
                  <SelectItem value="difficulty">By Difficulty</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {deleteOption === "language" && (
              <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                <SelectTrigger className="w-full bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                  <SelectGroup>
                    <SelectLabel className="text-[#05FFF8]">Languages</SelectLabel>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {deleteOption === "difficulty" && (
              <Select onValueChange={setSelectedDifficulty} value={selectedDifficulty}>
                <SelectTrigger className="w-full bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                  <SelectValue placeholder="Select a difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1040] border-[#9D4EDD]/30 text-[#D1D7E0]">
                  <SelectGroup>
                    <SelectLabel className="text-[#05FFF8]">Difficulties</SelectLabel>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <div className="mt-4 p-3 cursor-pointer bg-[#FF2A6D]/10 border text-white border-[#FF2A6D]/30 rounded-md ">
              <p className="text-white mb-2 font-semibold">You're about to:</p>
              <p>{getConfirmationMessage()}</p>
              <p className="mt-2 font-semibold text-[#FF2A6D]">This action cannot be undone.</p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1A1040] text-[#D1D7E0] border border-[#9D4EDD]/30 hover:bg-[#9D4EDD]/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting || isDeleteButtonDisabled}
              className={`bg-[#FF2A6D] text-white hover:bg-[#ff2a4a] cursor-pointer flex items-center ${
                isDeleteButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {getDeleteMessage()}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteComponent