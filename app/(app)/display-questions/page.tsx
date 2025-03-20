"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft, Loader2, Search, Award, Copy, AlertCircle, Code, Layers, ExternalLink, Book } from "lucide-react";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExplainQuestionComponent from "@/components/ExplainQuestion";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  language?: string;
}

function DisplayQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [explainDialogOpen, setExplainDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchQuery = useSearchParams();
  const router = useRouter();
  
  const companyId = searchQuery.get("companyId");
  const roundId = searchQuery.get("roundId");
  const roundName = searchQuery.get("roundName");
  const language = searchQuery.get("language");
  const difficulty = searchQuery.get("difficulty");

  useEffect(() => {
    if (!companyId || !roundId) return;

    const handleFetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let url = `${backendUrl}/question/fetch-questions?roundId=${roundId}&companyId=${companyId}`;
        if (language) url += `&language=${encodeURIComponent(language)}`;
        if (difficulty) url += `&difficulty=${encodeURIComponent(difficulty)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load questions (Status: ${response.status})`);
        }

        const data = await response.json();
        toast.success("Questions fetched successfully");
        
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          setQuestions([]);
          console.error("Invalid questions data format:", data);
        }
      } catch (error) {
        toast.error("Failed to fetch questions.")
        console.error("Failed to fetch questions", error);
        setError("Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchQuestions();
  }, [companyId, roundId, language, difficulty, backendUrl]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; 
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-[#05FFF8]/20 text-[#05FFF8] border-[#05FFF8]/30';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (question: string, id: string) => {
    navigator.clipboard.writeText(question);
    setCopiedId(id);
    toast.success("Question copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExplain = (question: Question) => {
    setSelectedQuestion(question);
    setExplainDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-[#05FFF8] mb-10 cursor-pointer hover:text-[#05FFF8]/80 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>
        
        <div className="bg-gradient-to-br from-[#1A1040] to-[#231651] p-6 rounded-xl border border-[#9D4EDD]/30 shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#05FFF8] to-[#9D4EDD]">
            {roundName || "Interview"} Questions
          </h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {difficulty && (
              <div className={`px-3 py-1 text-sm rounded-full border flex items-center ${getDifficultyColor(difficulty)}`}>
                <Award className="h-3 w-3 mr-1" />
                {`${difficulty} Difficulty`}
              </div>
            )}
            
            {language && (
              <div className="px-3 py-1 text-sm rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30 flex items-center">
                <Code className="h-3 w-3 mr-1" />
                {language}
              </div>
            )}
            
            <div className="px-3 py-1 text-sm rounded-full bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/30 flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              {questions.length} Questions
            </div>
          </div>
          
          <p className="text-[#D1D7E0]/80 text-sm">
            Study these questions to ace your upcoming interview. Click on a question to see its answer, use the Explain feature for detailed breakdowns, or copy questions for later review.
          </p>
        </div>
        
        {/* Search input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#9D4EDD]" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1A1040] border border-[#9D4EDD]/30 rounded-lg text-[#D1D7E0] placeholder-[#D1D7E0]/50 focus:outline-none focus:ring-2 focus:ring-[#05FFF8]/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Content section */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-[#9D4EDD] animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-[#FF9F1C]/20 border border-[#FF9F1C] p-4 rounded-lg text-[#FF9F1C] flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-[#231651] border border-[#9D4EDD]/30 rounded-xl p-8 text-center">
          <p className="text-[#D1D7E0]/70">
            {searchTerm ? "No questions match your search criteria." : "No questions available for this selection."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, index) => (
            <div
              key={q.id}
              className="bg-gradient-to-br from-[#1A1040] to-[#231651] rounded-xl border border-[#9D4EDD]/30 shadow-md hover:shadow-lg hover:shadow-[#9D4EDD]/10 transition-all duration-300"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={q.id} className="border-none">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="text-[#05FFF8] font-medium mr-2">Q{index + 1}.</span>
                        <span className="mr-2">{getDifficultyEmoji(q.difficulty)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(q.question, q.id);
                          }}
                          className="p-2 text-[#D1D7E0]/70 hover:text-[#05FFF8] rounded-full transition-colors cursor-pointer"
                          title="Copy question"
                        >
                          {copiedId === q.id ? (
                            <span className="text-xs text-[#05FFF8]">Copied!</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <AccordionTrigger className="cursor-pointer hover:no-underline py-0">
                      <p className="text-[#D1D7E0] font-medium text-left cursor-pointer hover:text-[#05FFF8]/80 transition-colors">{q.question}</p>
                    </AccordionTrigger>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getDifficultyColor(q.difficulty)}`}>
                        <Award className="h-3 w-3 mr-1" />
                        {q.difficulty}
                      </span>
                      
                      {q.language && (
                        <span className="px-2 py-1 text-xs rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30">
                          {q.language}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <AccordionContent className="px-5 pb-5 pt-1 text-[#D1D7E0]/90">
                    <div className="mt-4 pt-4 border-t border-[#9D4EDD]/20">
                      <div className="flex items-center mb-2">
                        <Book className="h-4 w-4 text-[#05FFF8] mr-2" />
                        <h3 className="text-[#05FFF8] font-medium">Answer:</h3>
                      </div>
                      <div className="bg-[#1A1040]/50 p-4 rounded-lg border border-[#9D4EDD]/20 mb-4">
                        <p className="whitespace-pre-line">{q.answer || "No official answer provided for this question."}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => handleExplain(q)}
                          className="bg-[#FF2A6D] text-white border border-[#ff2a4a] hover:bg-[#ff2a4a] transition-colors cursor-pointer"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Explain
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      )}
      
      {/* Explain Question Dialog */}
      {selectedQuestion && (
        <ExplainQuestionComponent
          question={selectedQuestion.question}
          questionId={selectedQuestion.id}
          isOpen={explainDialogOpen}
          onClose={() => setExplainDialogOpen(false)}
        />
      )}
      
      {/* Footer */}
      {filteredQuestions.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-[#D1D7E0]/60 text-sm">
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
        </div>
      )}
    </div>
  );
}

export default DisplayQuestions;