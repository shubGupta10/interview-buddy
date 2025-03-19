"use client";

import { useEffect, useState } from "react";
import { Award, Code, Filter, X, Search, ChevronLeft, Layers, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Question = {
    id: string;
    question: string;
    language: string;
    difficulty: string;
};

const LastGenerated = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [categorizedQuestions, setCategorizedQuestions] = useState<Record<string, Question[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    
    useEffect(() => {
        const loadQuestions = () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Try to load from localStorage first
                const storedQuestions = localStorage.getItem("question-storage");
                
                if (storedQuestions) {
                    // Parse the stored questions
                    const parsedData = JSON.parse(storedQuestions);
                    const questionsList = parsedData.state?.questions || [];
                    
                    setQuestions(questionsList);
                    
                    // Categorize questions by language
                    const categorized: Record<string, Question[]> = {};
                    questionsList.forEach((q: Question) => {
                        if (!categorized[q.language]) {
                            categorized[q.language] = [];
                        }
                        categorized[q.language].push(q);
                    });
                    setCategorizedQuestions(categorized);
                } else {
                    // If localStorage doesn't have data, check if we're using a store
                    // This would be implemented if you're using useQuestionStore
                    // For now we'll set an error since we don't have the store implementation
                    setError("No stored questions found");
                }
            } catch (error) {
                console.error("Error loading questions:", error);
                setError("Error loading questions. Please check the browser storage.");
            } finally {
                setIsLoading(false);
            }
        };
        
        loadQuestions();
    }, []);
    
    const handleCategorySelect = (language: string) => {
        // If the same category is clicked again, toggle it off
        if (selectedCategory === language) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(language);
        }
    };
    
    // Get unique difficulty levels
    const difficulties = Array.from(
        new Set(questions.map(q => q.difficulty))
    ).filter(Boolean);

    // Get difficulty badge color
    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty.toLowerCase()) {
            case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-[#05FFF8]/20 text-[#05FFF8] border-[#05FFF8]/30';
        }
    };

    // Difficulty emoji
    const getDifficultyEmoji = (difficulty: string) => {
        switch(difficulty.toLowerCase()) {
            case 'easy': return '🟢';
            case 'medium': return '🟡';
            case 'hard': return '🔴';
            default: return '⚪';
        }
    };

    // Get language icon
    const getLanguageIcon = (language: string) => {
        switch(language.toLowerCase()) {
            case 'python': return '🐍';
            case 'javascript': return '📜';
            case 'java': return '☕';
            case 'go': return '🐹';
            case 'php': return '🐘';
            case 'behavioral': return '🧠';
            case 'hr': return '👥';
            case 'managerial': return '👔';
            default: return '💻';
        }
    };
    
    // Filter questions based on search term and selected filters
    const filteredQuestions = (selectedCategory 
        ? categorizedQuestions[selectedCategory]?.filter(q => !selectedDifficulty || q.difficulty === selectedDifficulty) || []
        : questions.filter(q => !selectedDifficulty || q.difficulty === selectedDifficulty))
        .filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header section */}
            <div className="mb-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-[#05FFF8] mb-4 hover:text-[#05FFF8]/80 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                </button>
                
                <div className="bg-gradient-to-br from-[#1A1040] to-[#231651] p-6 rounded-xl border border-[#9D4EDD]/30 shadow-lg mb-6">
                    <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#05FFF8] to-[#9D4EDD]">
                        Previous Questions
                    </h1>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                        {selectedDifficulty && (
                            <div className={`px-3 py-1 text-sm rounded-full border flex items-center ${getDifficultyColor(selectedDifficulty)}`}>
                                <Award className="h-3 w-3 mr-1" />
                                {`${selectedDifficulty} Difficulty`}
                            </div>
                        )}
                        
                        {selectedCategory && (
                            <div className="px-3 py-1 text-sm rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30 flex items-center">
                                <Code className="h-3 w-3 mr-1" />
                                {selectedCategory}
                            </div>
                        )}
                        
                        <div className="px-3 py-1 text-sm rounded-full bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/30 flex items-center">
                            <Layers className="h-3 w-3 mr-1" />
                            {questions.length} Questions
                        </div>
                    </div>
                    
                    <p className="text-[#D1D7E0]/80 text-sm">
                        Browse and filter your previously generated questions by category and difficulty level.
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

                {/* Filters section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[#05FFF8] text-lg font-medium flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter Questions
                        </h2>
                        
                        {(selectedCategory || selectedDifficulty) && (
                            <button 
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedDifficulty(null);
                                }}
                                className="flex items-center text-[#FF2A6D] text-sm hover:text-[#FF2A6D]/80 transition-colors"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear filters
                            </button>
                        )}
                    </div>
                    
                    {/* Language filters */}
                    {Object.keys(categorizedQuestions).length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-[#9D4EDD] text-md font-medium mb-3 flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                Filter by Language
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {Object.keys(categorizedQuestions).map((language) => (
                                    <div
                                        key={language}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between hover:bg-[#9D4EDD]/10 hover:border-[#9D4EDD]/50 ${
                                            selectedCategory === language 
                                                ? 'bg-[#9D4EDD]/20 border-[#9D4EDD]/50' 
                                                : 'bg-[#1A1040] border-[#9D4EDD]/20'
                                        }`}
                                        onClick={() => handleCategorySelect(language)}
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-2 text-lg">{getLanguageIcon(language)}</span>
                                            <span className="text-[#D1D7E0]">{language}</span>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-[#1A1040] text-[#D1D7E0]/70">
                                            {categorizedQuestions[language].length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Difficulty filters */}
                    {difficulties.length > 0 && (
                        <div>
                            <h3 className="text-[#9D4EDD] text-md font-medium mb-3 flex items-center">
                                <Award className="w-4 h-4 mr-2" />
                                Filter by Difficulty
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {difficulties.map((difficulty) => (
                                    <div
                                        key={difficulty}
                                        className={`px-4 py-2 border rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                                            selectedDifficulty === difficulty 
                                                ? getDifficultyColor(difficulty)
                                                : 'bg-[#1A1040] border-[#9D4EDD]/20 text-[#D1D7E0] hover:bg-[#9D4EDD]/10'
                                        }`}
                                        onClick={() => setSelectedDifficulty(
                                            selectedDifficulty === difficulty ? null : difficulty
                                        )}
                                    >
                                        <Award className="w-4 h-4 mr-2" />
                                        {difficulty}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content section */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-[#9D4EDD] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-[#FF9F1C]/20 border border-[#FF9F1C] p-4 rounded-lg text-[#FF9F1C] flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="bg-[#231651] border border-[#9D4EDD]/30 rounded-xl p-8 text-center">
                    <p className="text-[#D1D7E0]/70">
                        {searchTerm 
                            ? "No questions match your search criteria." 
                            : selectedCategory || selectedDifficulty 
                                ? "No questions match your selected filters." 
                                : "No questions available."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map((q, index) => (
                        <div
                            key={q.id}
                            className="p-5 bg-gradient-to-br from-[#1A1040] to-[#231651] rounded-xl border border-[#9D4EDD]/30 shadow-md hover:shadow-lg hover:shadow-[#9D4EDD]/10 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <span className="text-[#05FFF8] font-medium mr-2">Q{index + 1}.</span>
                                    <span className="mr-2">{getDifficultyEmoji(q.difficulty)}</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30">
                                        {q.language}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-[#D1D7E0] font-medium mb-3">{q.question}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getDifficultyColor(q.difficulty)}`}>
                                    <Award className="h-3 w-3 mr-1" />
                                    {q.difficulty}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
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
};

export default LastGenerated;