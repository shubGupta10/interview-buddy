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

function GenerateQuestions() {
    const { setQuestions } = useQuestionStore();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [difficulty, setDifficulty] = useState<string | undefined>();
    const [language, setLanguage] = useState<string | undefined>();
    
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

    const handleGenerateQuestions = async () => {
        if (!difficulty) {
            alert("Please select difficulty before generating questions.");
            return;
        }

        // Prepare request body
        const requestBody: any = { companyId, roundId, roundName, difficulty };

        // Add language **only if** it's required
        if (!roundsWithoutLanguage.includes(roundName!)) {
            if (!language) {
                alert("Please select a programming language.");
                return;
            }
            requestBody.language = language;
        }

        try {
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
            alert("Questions generated successfully!");
        } catch (error) {
            console.error("Error generating questions:", error);
            alert("Error generating questions. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Now fill one last step</h2>

            <div className="space-y-4">
                {/* Round Name Input */}
                <div>
                    <Label>Round Name</Label>
                    <Input placeholder="Enter round name" value={roundName || ""} readOnly />
                </div>

                {/* Select Difficulty */}
                <div>
                    <Label>Select Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Show Language Selection ONLY if required */}
                {!roundsWithoutLanguage.includes(roundName!) && (
                    <div>
                        <Label>Select Language</Label>
                        <Select value={language} onValueChange={(value) => setLanguage(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="go">Go</SelectItem>
                                <SelectItem value="php">PHP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Generate Button */}
                <Button onClick={handleGenerateQuestions}>Generate Questions</Button>
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
