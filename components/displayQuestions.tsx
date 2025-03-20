"use client"

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

interface Question {
  id: string;
  question: string;
  difficulty: string;
}

function DisplayQuestions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const searchQuery = useSearchParams();
    const companyId = searchQuery.get("companyId");
    const roundId = searchQuery.get("roundId")

    const handleFetchQuestions = async () => {
        try {
            const response = await fetch(`${backendUrl}/question/fetch-questions?roundId=${roundId}?companyId=${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({companyId: companyId, roundId: roundId})
            })
            const data = await response.json();
            console.log("questions", data.questions);
            
        } catch (error) {
            throw new Error("Failed to fetch")
        }
    }
    handleFetchQuestions();


    if (!Array.isArray(questions)) {
      console.error("Invalid questions data:", questions);
      return <p className="text-red-500">No valid questions available.</p>;
    }
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Questions List</h2>
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q.id} className="p-3 bg-gray-100 text-black rounded-md shadow-md">
              <p className="font-medium">{q.question}</p>
              <span className="text-sm text-gray-600">Difficulty: {q.difficulty}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

export default DisplayQuestions;
