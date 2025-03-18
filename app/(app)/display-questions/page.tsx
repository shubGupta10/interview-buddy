"use client"

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
    const roundId = searchQuery.get("roundId");

    useEffect(() => {
        if (!companyId || !roundId) return;

        const handleFetchQuestions = async () => {
            try {
                const response = await fetch(`${backendUrl}/question/fetch-questions?roundId=${roundId}&companyId=${companyId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched Questions:", data.questions);
                setQuestions(data.questions || []);
                
            } catch (error) {
                console.error("Failed to fetch questions", error);
            }
        };

        handleFetchQuestions();
    }, [companyId, roundId, backendUrl]);

    if (!Array.isArray(questions)) {
        console.error("Invalid questions data:", questions);
        return <p className="text-red-500">No valid questions available.</p>;
    }

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Questions List</h2>
        <ul className="space-y-2">
          {questions.length === 0 ? (
            <p>No questions available</p>
          ) : (
            questions.map((q) => (
              <li key={q.id} className="p-3 bg-gray-100 text-black rounded-md shadow-md">
                <p className="font-medium">{q.question}</p>
                <span className="text-sm text-gray-600">Difficulty: {q.difficulty}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    );
}

export default DisplayQuestions;
