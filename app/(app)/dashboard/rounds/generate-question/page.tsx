"use client"

import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import useQuestionStore from "@/app/store/useQuestionStore"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ChevronRight,
  AlertCircle,
  Loader2,
  BarChart3,
  Code,
  History,
  Building,
  Target,
  AlertTriangle,
} from "lucide-react"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

function GenerateQuestions() {
  const { setQuestions } = useQuestionStore()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [difficulty, setDifficulty] = useState<string | undefined>()
  const [language, setLanguage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitReached, setRateLimitReached] = useState(false)
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null)
  const [generationCount, setGenerationCount] = useState(0)

  const searchQuery = useSearchParams()
  const roundName = searchQuery.get("roundName")
  const companyId = searchQuery.get("companyId")
  const roundId = searchQuery.get("roundId")
  const session = useSession()

  const router = useRouter()

  const roundsWithoutLanguage = ["Behavioral Interview", "HR Round", "Managerial Round"]

  const getRoundEmoji = (roundName: string): string => {
    switch (roundName) {
      case "Behavioral Interview":
        return "🧠"
      case "HR Round":
        return "👥"
      case "Managerial Round":
        return "👔"
      case "Technical Interview":
        return "💻"
      case "System Design":
        return "🏗️"
      case "Data Structures":
        return "🔢"
      case "Algorithms":
        return "🧮"
      default:
        return "🎯"
    }
  }

  useEffect(() => {
    const fetchGenerationLimitStatus = async () => {
      if (session.data?.user.id) {
        try {
          const response = await fetch(`${backendUrl}/question/track-generation-limit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: session.data?.user.id })
          });

          const data = await response.json();
          
          if (data.success) {
            setGenerationCount(data.used);
            if (data.remaining <= 0) {
              setRateLimitReached(true);
              setRateLimitMessage(`You have reached the limit of 5 requests. Please try again in ${data.resetIn}.`);
            } else {
              setRateLimitReached(false);
              setRateLimitMessage(null);
            }
          }
        } catch (error) {
          console.error("Error fetching generation limit status:", error);
        }
      }
    };

    fetchGenerationLimitStatus();
  }, [session.data?.user.id, backendUrl]);

  const handleGenerateQuestions = async () => {
    if (!difficulty) {
      setError("Please select difficulty before generating questions.");
      return;
    }

    if (rateLimitReached) {
      toast.error(rateLimitMessage || "Daily question generation limit reached. Please try again later.");
      return;
    }

    const requestBody: any = {
      userId: session.data?.user.id,
      companyId,
      roundId,
      roundName,
      difficulty,
    };

    if (!roundsWithoutLanguage.includes(roundName!)) {
      if (!language) {
        setError("Please select a programming language.");
        return;
      }
      requestBody.language = language;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}/question/generate-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        setRateLimitReached(true);
        setRateLimitMessage(
          errorData.message || "You have reached the limit of 5 requests. Please try again later."
        );
        toast.error(errorData.message || "Question generation limit reached. Please try again later.");
        return;
      }

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error("Failed to generate questions.");
      }

      const data = JSON.parse(responseText);
      setQuestions(data.questions);
      router.push(
        `/display-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}&difficulty=${difficulty}${language ? `&language=${language}` : ""
        }`
      );
      toast.success("Your questions are ready! Good luck with your preparation.");

      const limitResponse = await fetch(`${backendUrl}/question/track-generation-limit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: session.data?.user.id })
      });

      const limitData = await limitResponse.json();

      if (limitData.success) {
        setGenerationCount(limitData.used);

        if (limitData.remaining <= 0) {
          setRateLimitReached(true);
          setRateLimitMessage(`You have reached the limit of 5 requests. Please try again in ${limitData.resetIn}.`);
        }
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Oops! We couldn't generate your questions. Please check your selections and try again.");
      setError("Error generating questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const navigateToPreviousQuestions = () => {
    router.push(`/prev-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1040] to-[#231651] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className=" text-[#05FFF8] hover:text-[#05FFF8]/80 flex items-center cursor-pointer transition-colors mb-10"
        >
          <ChevronRight className="rotate-180 mr-1" size={18} /> Back to Rounds page
        </button>

        {/* Rate Limit Warning Banner - Show when limit is reached */}
        {rateLimitReached && (
          <div className="mb-6 bg-gradient-to-r from-[#ff2a6d]/10 to-[#ff2a6d]/20 rounded-xl shadow-lg p-4 border-2 border-[#ff2a6d]/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#ff2a6d]/20 mr-4">
                <AlertTriangle className="w-6 h-6 text-[#ff2a6d]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#ff2a6d]">Daily Limit Reached</h3>
                <p className="text-[#D1D7E0]/80 text-sm">
                  {rateLimitMessage || "You have reached the limit of 5 requests. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Previous Questions Banner - Separate from main form */}
        <div className="mb-6 bg-gradient-to-r from-[#05FFF8]/10 to-[#9D4EDD]/10 rounded-xl shadow-lg p-4 border-2 border-[#9D4EDD]/30  transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 rounded-full bg-[#05FFF8]/20 mr-4">
                <History className="w-6 h-6 text-[#05FFF8]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#05FFF8]">Previous Questions Available</h3>
                <p className="text-[#D1D7E0]/80 text-sm">
                  Review questions you've previously generated for this round.
                </p>
              </div>
            </div>
            <Button
              onClick={navigateToPreviousQuestions}
              className="bg-[#ff2a6d] hover:bg-[#ff2a6d] text-white border border-[#9D4EDD]/50 font-medium px-6 py-5 rounded-lg transition-all duration-300 shadow-lg cursor-pointer flex items-center"
            >
              <History className="w-5 h-5 mr-2" />
              View Previous Questions
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#231651] rounded-xl shadow-xl p-6 border border-[#9D4EDD]/30">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-block p-3 rounded-full bg-[#1A1040] border border-[#9D4EDD]/50 mb-4">
              <Target className="w-8 h-8 text-[#05FFF8]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#05FFF8] to-[#9D4EDD]">
              Final Step
            </h2>
            <p className="text-[#D1D7E0]/80 max-w-xl mx-auto">
              Customize your question set to match your interview preparation needs.
            </p>
          </div>

          <div className="space-y-5">
            {/* Info Summary Box */}
            <div className="bg-[#1A1040]/70 rounded-lg p-4 border border-[#9D4EDD]/20 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#05FFF8] font-medium flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Interview Details
                </span>
                <span className="text-2xl">{getRoundEmoji(roundName || "")}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#D1D7E0]/60 mb-1">Round Type</p>
                  <p className="text-[#D1D7E0] font-medium">{roundName || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Settings Box */}
            <div className="bg-[#1A1040]/70 rounded-lg p-4 border border-[#9D4EDD]/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#05FFF8] font-medium flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Question Settings
                </h3>
                <div className="flex items-center bg-[#1A1040] px-3 py-1 rounded-md border border-[#9D4EDD]/30">
                  <span className="text-[#D1D7E0]/80 text-sm mr-2">Generations Today:</span>
                  <span className={`font-bold text-lg ${generationCount >= 5 ? "text-[#ff2a6d]" : "text-[#05FFF8]"}`}>
                    {generationCount}/5
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Select Difficulty */}
                <div className="space-y-2">
                  <Label className="text-[#D1D7E0]/80 text-sm flex items-center">
                    <BarChart3 className="w-4 h-4 text-[#9D4EDD] mr-2" />
                    Question Difficulty
                  </Label>
                  <Select
                    value={difficulty}
                    onValueChange={(value) => {
                      setDifficulty(value)
                      setError(null)
                    }}
                  >
                    <SelectTrigger className="cursor-pointer w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8] h-12">
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer bg-[#231651] border-[#9D4EDD]/50">
                      <SelectItem value="easy" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                        Easy
                      </SelectItem>
                      <SelectItem value="medium" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                        Medium
                      </SelectItem>
                      <SelectItem value="hard" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Language Selection ONLY if required */}
                {!roundsWithoutLanguage.includes(roundName!) && (
                  <div className="space-y-2">
                    <Label className="text-[#D1D7E0]/80 text-sm flex items-center">
                      <Code className="w-4 h-4 text-[#9D4EDD] mr-2" />
                      Programming Language
                    </Label>
                    <Select
                      value={language}
                      onValueChange={(value) => {
                        setLanguage(value)
                        setError(null)
                      }}
                    >
                      <SelectTrigger className="cursor-pointer w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8] h-12">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="cursor-pointer bg-[#231651] border-[#9D4EDD]/50">
                        <SelectItem value="python" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                          Python
                        </SelectItem>
                        <SelectItem value="javascript" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                          JavaScript
                        </SelectItem>
                        <SelectItem value="java" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                          Java
                        </SelectItem>
                        <SelectItem value="go" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                          Go
                        </SelectItem>
                        <SelectItem value="php" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">
                          PHP
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && !rateLimitReached && (
              <div className="bg-[#FF9F1C]/10 border border-[#FF9F1C] p-4 rounded-lg text-[#FF9F1C] flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Generate Button - Now separate and standalone */}
            <div className="pt-2">
              <Button
                onClick={handleGenerateQuestions}
                disabled={isLoading || rateLimitReached}
                className={`w-full py-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer ${rateLimitReached
                  ? "bg-gray-500 hover:bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-[#ff2a6d] hover:bg-[#d12564]/90 text-white hover:shadow-[#9D4EDD]/20"
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : rateLimitReached ? (
                  <AlertTriangle className="w-5 h-5 mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isLoading
                  ? "Generating Questions..."
                  : rateLimitReached
                    ? "Daily Limit Reached"
                    : "Generate Questions"}
                {!isLoading && !rateLimitReached && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateQuestions

