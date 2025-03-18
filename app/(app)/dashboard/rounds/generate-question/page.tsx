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
import QuestionCategories from "@/components/QuestionCategories";
import { Sparkles, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

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
        switch(roundName) {
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
        <div className="p-6 bg-gradient-to-br from-[#1A1040] to-[#231651] rounded-xl shadow-lg max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#05FFF8] to-[#9D4EDD]">
                    Final Step
                </h2>
                <p className="text-[#D1D7E0]/80">
                    Customize your question set to match your interview preparation needs.
                </p>
            </div>

            <div className="space-y-6">
                {/* Round Name Card */}
                <div className="bg-[#231651] p-4 rounded-lg border border-[#9D4EDD]/30">
                    <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{getRoundEmoji(roundName || "")}</span>
                        <Label className="text-[#05FFF8] font-medium">Round Type</Label>
                    </div>
                    <Input 
                        placeholder="Enter round name" 
                        value={roundName || ""} 
                        readOnly 
                        className="bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8]"
                    />
                </div>

                {/* Select Difficulty */}
                <div className="bg-[#231651] p-4 rounded-lg border border-[#9D4EDD]/30">
                    <Label className="text-[#05FFF8] font-medium block mb-2">Question Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                        <SelectTrigger className="w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8]">
                            <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#231651] border-[#9D4EDD]/50">
                            <SelectItem value="easy" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Easy</SelectItem>
                            <SelectItem value="medium" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Medium</SelectItem>
                            <SelectItem value="hard" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Show Language Selection ONLY if required */}
                {!roundsWithoutLanguage.includes(roundName!) && (
                    <div className="bg-[#231651] p-4 rounded-lg border border-[#9D4EDD]/30">
                        <Label className="text-[#05FFF8] font-medium block mb-2">Programming Language</Label>
                        <Select value={language} onValueChange={(value) => setLanguage(value)}>
                            <SelectTrigger className="w-full bg-[#1A1040] text-[#D1D7E0] border-[#9D4EDD]/50 focus:border-[#05FFF8] focus:ring-1 focus:ring-[#05FFF8]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#231651] border-[#9D4EDD]/50">
                                <SelectItem value="python" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Python</SelectItem>
                                <SelectItem value="javascript" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">JavaScript</SelectItem>
                                <SelectItem value="java" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Java</SelectItem>
                                <SelectItem value="go" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">Go</SelectItem>
                                <SelectItem value="php" className="text-[#D1D7E0] hover:bg-[#9D4EDD]/20">PHP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-[#FF9F1C]/20 border border-[#FF9F1C] p-3 rounded-lg text-[#FF9F1C] flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Generate Button */}
                <Button 
                    onClick={handleGenerateQuestions}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#FF2A6D] to-[#9D4EDD] hover:from-[#FF2A6D]/90 hover:to-[#9D4EDD]/90 text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#FF2A6D]/20 flex items-center justify-center"
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

                <QuestionCategories 
                    companyId={companyId || ""} 
                    roundId={roundId || ""} 
                    roundName={roundName || ""} 
                />
        </div>
    );
}

export default GenerateQuestions;