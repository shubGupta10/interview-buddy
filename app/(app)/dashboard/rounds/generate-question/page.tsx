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
import DisplayQuestions from "@/components/displayQuestions";
import { useRouter } from "next/navigation";

function GenerateQuestions() {
    const {setQuestions, questions} = useQuestionStore()
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [difficulty, setDifficulty] = useState<string | undefined>();
    const [language, setLanguage] = useState<string | undefined>();
    const searchQuery = useSearchParams();
    const roundName = searchQuery.get("roundName");
    const companyId = searchQuery.get("companyId");
    const roundId = searchQuery.get("roundId");
    console.log("Query Params:", { roundName, companyId, roundId });
    const router = useRouter()

    const handleGenerateQuestions = async () => {
        if (!difficulty || !language) {
            alert("Please select difficulty and language before generating questions.");
            return;
        }
    
        // Check the values before sending
        console.log("Sending payload:", {
            companyId,
            roundId,
            roundName,
            difficulty,
            language,
        });
    
        try {
            const response = await fetch(`${backendUrl}/question/generate-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyId,
                    roundId,
                    roundName,
                    difficulty,
                    language,
                }),
            });
    
            const responseText = await response.text(); // Log response
            console.log("Raw Response:", responseText);
    
            if (!response.ok) {
                throw new Error("Failed to generate questions.");
            }
    
            const data = JSON.parse(responseText);
            setQuestions(data.questions);
            router.push(`/display-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}`);
            console.log("Questions generated:", data);
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
                    <Select onValueChange={(value) => setDifficulty(value)}>
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

                {/* Select Language */}
                <div>
                    <Label>Select Language</Label>
                    <Select onValueChange={(value) => setLanguage(value)}>
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

                {/* Generate Button */}
                <Button onClick={handleGenerateQuestions}>Generate Questions</Button>
            </div>

            {/* Display questions */}
            {/* <DisplayQuestions questions={questions} /> */}
        </div>
    );
}

export default GenerateQuestions;
