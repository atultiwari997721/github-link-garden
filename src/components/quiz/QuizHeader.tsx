
import { Brain, Upload, Zap, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface QuizHeaderProps {
  activeView: 'upload' | 'generate' | 'play';
  onViewChange: (view: 'upload' | 'generate' | 'play') => void;
  documentsCount: number;
  quizzesCount: number;
}

export const QuizHeader = ({ activeView, onViewChange, documentsCount, quizzesCount }: QuizHeaderProps) => {
  return (
    <header className="bg-black/20 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Quiz Generator</h1>
              <p className="text-sm text-white/70">Upload documents and generate smart quizzes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Back to Links
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6 mt-4">
          <Button
            variant={activeView === 'upload' ? 'default' : 'ghost'}
            onClick={() => onViewChange('upload')}
            className={`flex items-center space-x-2 ${
              activeView === 'upload' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Documents</span>
            {documentsCount > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {documentsCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={activeView === 'generate' ? 'default' : 'ghost'}
            onClick={() => onViewChange('generate')}
            className={`flex items-center space-x-2 ${
              activeView === 'generate' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Generate Quizzes</span>
            {quizzesCount > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {quizzesCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={activeView === 'play' ? 'default' : 'ghost'}
            onClick={() => onViewChange('play')}
            className={`flex items-center space-x-2 ${
              activeView === 'play' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Play Quiz</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
