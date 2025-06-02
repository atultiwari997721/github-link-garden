
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Quiz } from '@/pages/QuizPlatform';

interface QuizPlayerProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizPlayer = ({ quiz, onBack }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const correctAnswers = answers.filter((answer, index) => 
    answer === quiz.questions[index].correctAnswer
  ).length;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setShowResult(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setShowResult(false);
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setIsQuizCompleted(false);
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = () => {
    if (score >= 80) return { text: 'Excellent!', color: 'bg-green-600' };
    if (score >= 60) return { text: 'Good!', color: 'bg-yellow-600' };
    return { text: 'Try Again!', color: 'bg-red-600' };
  };

  if (isQuizCompleted) {
    const badge = getScoreBadge();
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className={`w-16 h-16 ${getScoreColor()}`} />
            </div>
            <CardTitle className="text-white text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
                {score}%
              </div>
              <Badge className={`${badge.color} text-white text-lg px-4 py-2`}>
                {badge.text}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{quiz.questions.length}</div>
                <div className="text-white/70 text-sm">Total Questions</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{correctAnswers}</div>
                <div className="text-white/70 text-sm">Correct</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{quiz.questions.length - correctAnswers}</div>
                <div className="text-white/70 text-sm">Incorrect</div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <Button
                onClick={handleRestartQuiz}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Quiz
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <p className="text-white/70">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        </div>
        
        <Badge className="bg-purple-600/20 text-purple-300">
          Topic: {quiz.topic}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-white/10" />
        <div className="flex justify-between text-sm text-white/70 mt-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-white/5 backdrop-blur border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "bg-green-600/20 border-green-500 text-green-300";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass += "bg-red-600/20 border-red-500 text-red-300";
                } else {
                  buttonClass += "bg-white/5 border-white/10 text-white/70";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "bg-purple-600/30 border-purple-500 text-white";
                } else {
                  buttonClass += "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-300 font-medium mb-2">Explanation:</h4>
              <p className="text-white/80">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Previous
        </Button>

        <div className="space-x-3">
          {selectedAnswer !== null && !showResult && (
            <Button
              onClick={handleShowResult}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Show Answer
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};
