
import { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Document } from '@/pages/QuizPlatform';

interface DocumentUploadProps {
  documents: Document[];
  onDocumentUpload: (document: Document) => void;
  onSelectDocument: (document: Document) => void;
}

export const DocumentUpload = ({ documents, onDocumentUpload, onSelectDocument }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractTopicsFromContent = (content: string): string[] => {
    // Simple topic extraction - in real app this would use AI
    const sentences = content.split(/[.!?]+/);
    const topics = new Set<string>();
    
    // Look for capitalized words that might be topics
    sentences.forEach(sentence => {
      const words = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (words) {
        words.forEach(word => {
          if (word.length > 3 && !['The', 'This', 'That', 'These', 'Those'].includes(word)) {
            topics.add(word);
          }
        });
      }
    });

    return Array.from(topics).slice(0, 5); // Limit to 5 topics
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('text') && !file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text file (.txt)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const content = await file.text();
      const topics = extractTopicsFromContent(content);
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        content,
        uploadedAt: new Date().toISOString(),
        topics
      };

      onDocumentUpload(newDocument);
      
      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been processed and ${topics.length} topics were identified.`
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your document.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Your Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-white/20 hover:border-white/40'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <FileText className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {isProcessing ? 'Processing document...' : 'Drop your document here'}
            </h3>
            <p className="text-white/70 mb-4">
              Upload text files (.txt) to generate AI-powered quizzes
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <h4 className="font-medium text-white truncate">{doc.name}</h4>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelectDocument(doc)}
                      className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.topics.slice(0, 3).map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-300 text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                    {doc.topics.length > 3 && (
                      <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                        +{doc.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-white/50">
                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
