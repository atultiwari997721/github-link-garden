
import { useState } from 'react';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { DocumentUpload } from '@/components/quiz/DocumentUpload';
import { QuizGeneration } from '@/components/quiz/QuizGeneration';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';

export interface Document {
  id: string;
  name: string;
  content: string;
  uploadedAt: string;
  topics: string[];
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
  documentId: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const QuizPlatform = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'generate' | 'play'>('upload');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleDocumentUpload = (document: Document) => {
    setDocuments([...documents, document]);
    console.log('Document uploaded:', document.name);
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    setQuizzes([...quizzes, quiz]);
    console.log('Quiz generated:', quiz.title);
  };

  const handlePlayQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveView('play');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <QuizHeader 
        activeView={activeView}
        onViewChange={setActiveView}
        documentsCount={documents.length}
        quizzesCount={quizzes.length}
      />
      
      <div className="container mx-auto px-4 py-8">
        {activeView === 'upload' && (
          <DocumentUpload 
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onSelectDocument={setSelectedDocument}
          />
        )}
        
        {activeView === 'generate' && (
          <QuizGeneration 
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
            onQuizGenerated={handleQuizGenerated}
            onPlayQuiz={handlePlayQuiz}
          />
        )}
        
        {activeView === 'play' && selectedQuiz && (
          <QuizPlayer 
            quiz={selectedQuiz}
            onBack={() => setActiveView('generate')}
          />
        )}
      </div>
    </div>
  );
};

export default QuizPlatform;
