import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Question {
    difficulty: string;
    id: string;
    question: string;
}

interface QuestionState {
    questions: Question[]; // Store multiple questions
    setQuestions: (questions: Question[]) => void; // Accepts an array of questions
}

const useQuestionStore = create<QuestionState>()(
    persist(
        (set) => ({
            questions: [],
            setQuestions: (questions) => set({ questions }), 
        }),
        { name: "question-storage" }
    )
);

export default useQuestionStore;
