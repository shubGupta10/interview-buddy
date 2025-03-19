"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useQuestionStore from "@/app/store/useQuestionStore";
import { useRouter } from "next/navigation";
import { 
    Sparkles, 
    ChevronRight, 
    AlertCircle, 
    Loader2, 
    BarChart3, 
    Code,
    History,
    Building,
    Target
} from "lucide-react";

function GenerateQuestions() {
    const { setQuestions } = useQuestionStore();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [difficulty, setDifficulty] = useState<string | undefined>();
    const [language, setLanguage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchQuery = useSearchParams();
    const roundName = searchQuery.get("roundName");
    const companyId = searchQuery.get("companyId");
    const roundId = searchQuery.get("roundId");

    const router = useRouter();

    const roundsWithoutLanguage = [
        "Behavioral Interview",
        "HR Round",
        "Managerial Round"
    ];

    // Get emoji based on round type
    const getRoundEmoji = (roundName: string): string => {
        switch (roundName) {
            case "Behavioral Interview": return "🧠";
            case "HR Round": return "👥";
            case "Managerial Round": return "👔";
            case "Technical Interview": return "💻";
            case "System Design": return "🏗️";
            case "Data Structures": return "🔢";
            case "Algorithms": return "🧮";
            default: return "🎯";
        }
    };

    const handleGenerateQuestions = async () => {
        if (!difficulty) {
            setError("Please select difficulty before generating questions.");
            return;
        }

        // Prepare request body
        const requestBody: any = { companyId, roundId, roundName, difficulty };

        // Add language **only if** it's required
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

            const responseText = await response.text();
            console.log("Raw Response:", responseText);

            if (!response.ok) {
                throw new Error("Failed to generate questions.");
            }

            const data = JSON.parse(responseText);
            setQuestions(data.questions);
            router.push(`/display-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}&difficulty=${difficulty}${language ? `&language=${language}` : ""}`);
        } catch (error) {
            console.error("Error generating questions:", error);
            setError("Error generating questions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A1040] to-[#231651] p-4 md:p-8">
            <div className="max-w-5xl mx-auto bg-[#231651] rounded-xl shadow-xl p-6 border border-[#9D4EDD]/30">
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
                        <h3 className="text-[#05FFF8] font-medium mb-4 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Question Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Select Difficulty */}
                            <div className="space-y-2">
                                <Label className="text-[#D1D7E0]/80 text-sm flex items-center">
                                    <BarChart3 className="w-4 h-4 text-[#9D4EDD] mr-2" />
                                    Question Difficulty
                                </Label>
                                <Select value={difficulty} onValueChange={(value) => { setDifficulty(value); setError(null); }}>
                                    <SelectTrigger className="cursor-pointer w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8] h-12">
                                        <SelectValue placeholder="Select Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent className="cursor-pointer bg-[#231651] border-[#9D4EDD]/50">
                                        <SelectItem value="easy" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Easy</SelectItem>
                                        <SelectItem value="medium" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Medium</SelectItem>
                                        <SelectItem value="hard" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Hard</SelectItem>
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
                                    <Select value={language} onValueChange={(value) => { setLanguage(value); setError(null); }}>
                                        <SelectTrigger className="cursor-pointer w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8] h-12">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent className="cursor-pointer bg-[#231651] border-[#9D4EDD]/50">
                                            <SelectItem value="python" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Python</SelectItem>
                                            <SelectItem value="javascript" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">JavaScript</SelectItem>
                                            <SelectItem value="java" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Java</SelectItem>
                                            <SelectItem value="go" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Go</SelectItem>
                                            <SelectItem value="php" className="cursor-pointer text-[#D1D7E0] hover:bg-[#9D4EDD]/20">PHP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-[#FF9F1C]/10 border border-[#FF9F1C] p-4 rounded-lg text-[#FF9F1C] flex items-center">
                            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 space-y-3 md:flex md:space-y-0 md:space-x-4">
                        {/* Previous Questions Button */}
                        <Button 
                            onClick={() => router.push(`/prev-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}`)}
                            className="w-full md:w-1/2 bg-[#1A1040] border border-[#9D4EDD]/50 hover:border-[#9D4EDD] text-[#D1D7E0] py-6 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer"
                        >
                            <History className="w-5 h-5 mr-2" />
                            View Previous Questions
                        </Button>

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerateQuestions}
                            disabled={isLoading}
                            className="w-full md:w-1/2 bg-[#ff2a6d] hover:bg-[#d12564]/90 text-white py-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#9D4EDD]/20 flex items-center justify-center cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 mr-2" />
                            )}
                            {isLoading ? "Generating Questions..." : "Generate Questions"}
                            {!isLoading && <ChevronRight className="w-5 h-5 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerateQuestions;