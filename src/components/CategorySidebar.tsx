
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen } from 'lucide-react';

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategorySidebarProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Folder className="w-5 h-5 mr-2 text-green-500" />
        Categories
      </h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group",
              selectedCategory === category
                ? "bg-green-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            )}
          >
            <div className="flex items-center">
              {selectedCategory === category ? (
                <FolderOpen className="w-4 h-4 mr-2" />
              ) : (
                <Folder className="w-4 h-4 mr-2" />
              )}
              <span className="capitalize">
                {category === 'all' ? 'All Links' : category}
              </span>
            </div>
            
            {category !== 'all' && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  selectedCategory === category
                    ? "bg-green-700 text-white"
                    : "bg-slate-600 text-slate-300"
                )}
              >
                {/* This would show count per category in a real app */}
                {Math.floor(Math.random() * 10) + 1}
              </Badge>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
        <p className="text-xs text-slate-400 mb-2">💡 Quick Tip</p>
        <p className="text-xs text-slate-300">
          Organize your repositories by creating custom categories for better navigation.
        </p>
      </div>
    </div>
  );
};
