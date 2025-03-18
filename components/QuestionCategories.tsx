import { useEffect, useState } from "react";

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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    useEffect(() => {
        const fetchQuestions = async () => {
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
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
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
    
    return (
        <div className="p-4">
            <h2>Find your previous questions</h2>
            <h2 className="text-xl font-semibold mb-4">{roundName} - Question Categories</h2>
            
            {/* Language filters */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Filter by Language:</h3>
                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(categorizedQuestions).map((language) => (
                        <div
                            key={language}
                            className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${
                                selectedCategory === language ? 'bg-blue-100 border-blue-500' : ''
                            }`}
                            onClick={() => handleCategorySelect(language)}
                        >
                            {language} ({categorizedQuestions[language].length})
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Difficulty filters */}
            {difficulties.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-md font-medium mb-2">Filter by Difficulty:</h3>
                    <div className="flex gap-4">
                        {difficulties.map((difficulty) => (
                            <div
                                key={difficulty}
                                className={`px-4 py-2 border rounded cursor-pointer hover:bg-gray-100 ${
                                    selectedDifficulty === difficulty ? 'bg-green-100 border-green-500' : ''
                                }`}
                                onClick={() => setSelectedDifficulty(
                                    selectedDifficulty === difficulty ? null : difficulty
                                )}
                            >
                                {difficulty}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Questions display */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">
                    {selectedCategory ? `${selectedCategory} Questions` : 'All Questions'}
                    {selectedDifficulty ? ` (${selectedDifficulty})` : ''}
                </h3>
                
                <ul className="list-disc pl-5 mt-4">
                    {(selectedCategory ? categorizedQuestions[selectedCategory] : questions)
                        .filter(q => !selectedDifficulty || q.difficulty === selectedDifficulty)
                        .map((q) => (
                            <li key={q.id} className="mt-2">
                                <span className="font-medium">{q.question}</span>
                                <span className="text-sm ml-2 text-gray-500">
                                    [{q.language}, {q.difficulty}]
                                </span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default QuestionCategories;