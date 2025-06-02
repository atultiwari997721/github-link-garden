
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Github } from 'lucide-react';
import type { GitHubLink } from '@/pages/Index';

interface AddLinkFormProps {
  link?: GitHubLink | null;
  onSave: (link: Omit<GitHubLink, 'id' | 'createdAt'> | GitHubLink) => void;
  onCancel: () => void;
}

const categories = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Mobile',
  'Desktop',
  'CLI Tools',
  'Libraries',
  'Documentation',
  'Personal',
  'Work',
  'Learning',
  'Other'
];

const languages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Java',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Other'
];

export const AddLinkForm = ({ link, onSave, onCancel }: AddLinkFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    language: '',
    stars: '',
    isPrivate: false,
  });

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description,
        category: link.category,
        language: link.language || '',
        stars: link.stars?.toString() || '',
        isPrivate: link.isPrivate,
      });
    }
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const linkData = {
      ...formData,
      stars: formData.stars ? parseInt(formData.stars) : undefined,
    };

    if (link) {
      onSave({ ...link, ...linkData });
    } else {
      onSave(linkData as Omit<GitHubLink, 'id' | 'createdAt'>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {link ? 'Edit Link' : 'Add New Link'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="url" className="text-white">GitHub URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://github.com/username/repo"
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your project..."
              rows={3}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-white">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language" className="text-white">Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {languages.map((language) => (
                    <SelectItem key={language} value={language} className="text-white">
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stars" className="text-white">Stars</Label>
              <Input
                id="stars"
                type="number"
                value={formData.stars}
                onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                placeholder="0"
                min="0"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="private" className="text-white">Private Repository</Label>
              <Switch
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {link ? 'Update Link' : 'Add Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
