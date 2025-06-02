
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import QuizPlatform from './pages/QuizPlatform';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz-platform" element={<QuizPlatform />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
