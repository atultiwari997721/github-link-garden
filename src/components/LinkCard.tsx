
import { ExternalLink, Edit, Trash2, Star, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GitHubLink } from '@/pages/Index';

interface LinkCardProps {
  link: GitHubLink;
  onEdit: () => void;
  onDelete: () => void;
}

export const LinkCard = ({ link, onEdit, onDelete }: LinkCardProps) => {
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      React: 'bg-cyan-500',
      Vue: 'bg-green-400',
      Angular: 'bg-red-500',
      Java: 'bg-orange-500',
      'C++': 'bg-purple-500',
      Go: 'bg-blue-400',
      Rust: 'bg-orange-600',
    };
    return colors[language] || 'bg-gray-500';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
            {link.title}
          </h3>
          {link.isPrivate ? (
            <Lock className="w-4 h-4 text-yellow-500" />
          ) : (
            <Globe className="w-4 h-4 text-green-500" />
          )}
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
        {link.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {link.language && (
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${getLanguageColor(link.language)}`} />
              <span className="text-sm text-slate-400">{link.language}</span>
            </div>
          )}
          {link.stars !== undefined && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-slate-400">{link.stars}</span>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
          {link.category}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Added {new Date(link.createdAt).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          onClick={() => window.open(link.url, '_blank')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View
        </Button>
      </div>
    </div>
  );
};
