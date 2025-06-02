
import { useState } from 'react';
import { Zap, Play, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Document, Quiz, Question } from '@/pages/QuizPlatform';

interface QuizGenerationProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onQuizGenerated: (quiz: Quiz) => void;
  onPlayQuiz: (quiz: Quiz) => void;
}

export const QuizGeneration = ({ 
  documents, 
  selectedDocument, 
  onSelectDocument, 
  onQuizGenerated, 
  onPlayQuiz 
}: QuizGenerationProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuizzes, setGeneratedQuizzes] = useState<Quiz[]>([]);
  const { toast } = useToast();

  // Simulate AI quiz generation
  const generateQuiz = async (document: Document, topic: string): Promise<Quiz> => {
    // In a real app, this would call an AI API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    const sampleQuestions: Question[] = [
      {
        id: '1',
        question: `What is the main concept related to ${topic} in the document?`,
        options: [
          `${topic} is a fundamental principle`,
          `${topic} is secondary to other concepts`,
          `${topic} is not mentioned`,
          `${topic} is outdated`
        ],
        correctAnswer: 0,
        explanation: `Based on the document content, ${topic} appears to be a key concept.`
      },
      {
        id: '2',
        question: `How does ${topic} relate to the document's main theme?`,
        options: [
          'It supports the main argument',
          'It contradicts the main theme',
          'It is unrelated',
          'It replaces the main theme'
        ],
        correctAnswer: 0,
        explanation: `The document presents ${topic} as supporting evidence for the main argument.`
      },
      {
        id: '3',
        question: `What would be a practical application of ${topic}?`,
        options: [
          'Academic research only',
          'Real-world implementation',
          'Historical reference',
          'Theoretical discussion'
        ],
        correctAnswer: 1,
        explanation: `${topic} has practical applications in real-world scenarios.`
      }
    ];

    return {
      id: Date.now().toString(),
      title: `${topic} Quiz`,
      topic,
      questions: sampleQuestions,
      documentId: document.id,
      createdAt: new Date().toISOString()
    };
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocument || !selectedTopic) {
      toast({
        title: "Selection required",
        description: "Please select a document and topic first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const quiz = await generateQuiz(selectedDocument, selectedTopic);
      setGeneratedQuizzes([...generatedQuizzes, quiz]);
      onQuizGenerated(quiz);
      
      toast({
        title: "Quiz generated successfully",
        description: `Created a quiz with ${quiz.questions.length} questions about ${selectedTopic}.`
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating the quiz.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardContent className="text-center py-16">
          <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Documents Available</h3>
          <p className="text-white/70 mb-6">
            Upload some documents first to start generating quizzes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quiz Generation Controls */}
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Generate AI Quiz</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Selection */}
          <div>
            <label className="block text-white font-medium mb-2">Select Document</label>
            <Select value={selectedDocument?.id || ''} onValueChange={(id) => {
              const doc = documents.find(d => d.id === id);
              if (doc) onSelectDocument(doc);
            }}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose a document" />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Selection */}
          {selectedDocument && (
            <div>
              <label className="block text-white font-medium mb-2">Select Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDocument.topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuiz}
            disabled={!selectedDocument || !selectedTopic || isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Quizzes */}
      {generatedQuizzes.length > 0 && (
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Generated Quizzes ({generatedQuizzes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-white">{quiz.title}</h4>
                    <Badge className="bg-purple-600/20 text-purple-300">
                      {quiz.questions.length} questions
                    </Badge>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-4">
                    Topic: {quiz.topic}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onPlayQuiz(quiz)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play Quiz
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
