import { useEffect, useState } from "react";
import { Book, Code, Filter, X, Award, Loader2 } from "lucide-react";

type Question = {
    id: string;
    question: string;
    language: string;
    difficulty: string;
};

type Props = {
    companyId: string;
    roundId: string;
    roundName: string;
};

const QuestionCategories: React.FC<Props> = ({ companyId, roundId, roundName }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [categorizedQuestions, setCategorizedQuestions] = useState<Record<string, Question[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!companyId || !roundId) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                let queryUrl = `${backendUrl}/question/fetch-questions-by-round?companyId=${companyId}&roundId=${roundId}`;
                
                // Add optional parameters if selected
                if (selectedCategory) {
                    queryUrl += `&language=${selectedCategory}`;
                }
                
                if (selectedDifficulty) {
                    queryUrl += `&difficulty=${selectedDifficulty}`;
                }
                
                const response = await fetch(queryUrl);
                const data = await response.json();
                
                if (data.success) {
                    setQuestions(data.questions);
                    
                    // Categorize questions by language
                    const categorized: Record<string, Question[]> = {};
                    data.questions.forEach((q: Question) => {
                        if (!categorized[q.language]) {
                            categorized[q.language] = [];
                        }
                        categorized[q.language].push(q);
                    });
                    setCategorizedQuestions(categorized);
                } else {
                    setError("Failed to fetch questions");
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setError("Error loading questions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchQuestions();
    }, [backendUrl, companyId, roundId, selectedCategory, selectedDifficulty]);
    
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
    
    const filteredQuestions = selectedCategory 
        ? categorizedQuestions[selectedCategory]?.filter(q => !selectedDifficulty || q.difficulty === selectedDifficulty) || []
        : questions.filter(q => !selectedDifficulty || q.difficulty === selectedDifficulty);

    return (
        <div className="mt-10 bg-gradient-to-br from-[#231651] to-[#1A1040] rounded-xl border border-[#9D4EDD]/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[#05FFF8] text-xl font-medium mb-1 flex items-center">
                        <Book className="w-5 h-5 mr-2" />
                        Previous Questions
                    </h2>
                    <p className="text-[#D1D7E0]/70 text-sm">
                        Browse questions from previous sessions
                    </p>
                </div>
                
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
            
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-[#9D4EDD] animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-[#FF9F1C]/20 border border-[#FF9F1C]/50 rounded-lg p-4 text-[#FF9F1C] text-sm">
                    {error}
                </div>
            ) : (
                <>
                    {/* Language filters */}
                    {Object.keys(categorizedQuestions).length > 0 ? (
                        <div className="mb-6">
                            <h3 className="text-[#9D4EDD] text-md font-medium mb-3 flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                Filter by Language
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                        <span className="text-sm px-2 py-1 rounded-full bg-[#1A1040] text-[#D1D7E0]/70">
                                            {categorizedQuestions[language].length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[#D1D7E0]/60">No questions found for this round.</p>
                        </div>
                    ) : null}
                    
                    {/* Difficulty filters */}
                    {difficulties.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-[#9D4EDD] text-md font-medium mb-3 flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
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
                    
                    {/* Questions display */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-[#05FFF8] mb-4 flex items-center">
                            {selectedCategory ? `${selectedCategory} Questions` : 'All Questions'}
                            {selectedDifficulty ? ` (${selectedDifficulty})` : ''}
                            <span className="ml-2 text-sm px-2 py-1 rounded-full bg-[#1A1040] text-[#D1D7E0]/70">
                                {filteredQuestions.length}
                            </span>
                        </h3>
                        
                        {filteredQuestions.length > 0 ? (
                            <div className="space-y-3">
                                {filteredQuestions.map((q) => (
                                    <div 
                                        key={q.id} 
                                        className="p-4 bg-[#1A1040] rounded-lg border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/40 transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[#D1D7E0] font-medium">{q.question}</span>
                                            <div className="flex gap-2">
                                                <span className="text-xs px-2 py-1 rounded-full bg-[#231651] text-[#05FFF8] border border-[#05FFF8]/20">
                                                    {q.language}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-[#1A1040] rounded-lg border border-[#9D4EDD]/20">
                                <p className="text-[#D1D7E0]/60">No questions match your current filters.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuestionCategories;