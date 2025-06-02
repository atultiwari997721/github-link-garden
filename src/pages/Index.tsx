import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkForm } from '@/components/AddLinkForm';
import { CategorySidebar } from '@/components/CategorySidebar';
import { Button } from '@/components/ui/button';
import { Plus, Github, Brain } from 'lucide-react';

export interface GitHubLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  stars?: number;
  language?: string;
  isPrivate: boolean;
  createdAt: string;
}

const Index = () => {
  const [links, setLinks] = useState<GitHubLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingLink, setEditingLink] = useState<GitHubLink | null>(null);

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('github-links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      // Add some sample links including random ones
      const sampleLinks: GitHubLink[] = [
        {
          id: '1',
          title: 'React Dashboard',
          url: 'https://github.com/username/react-dashboard',
          description: 'A modern React dashboard with TypeScript and Tailwind CSS',
          category: 'Frontend',
          stars: 42,
          language: 'TypeScript',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'API Server',
          url: 'https://github.com/username/api-server',
          description: 'RESTful API server built with Node.js and Express',
          category: 'Backend',
          stars: 18,
          language: 'JavaScript',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Atul\'s Portfolio',
          url: 'https://atultiwari997721.github.io',
          description: 'Personal portfolio website showcasing projects and skills',
          category: 'Personal',
          stars: 7,
          language: 'HTML',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Awesome ML Project',
          url: 'https://github.com/datascientist/ml-classifier',
          description: 'Machine learning classifier for image recognition tasks',
          category: 'Machine Learning',
          stars: 156,
          language: 'Python',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Mobile Game Engine',
          url: 'https://github.com/gamedev/unity-engine',
          description: 'Cross-platform mobile game engine built with Unity',
          category: 'Mobile',
          stars: 89,
          language: 'C++',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'CLI Tool Collection',
          url: 'https://github.com/clitools/dev-utils',
          description: 'Collection of useful CLI tools for developers',
          category: 'CLI Tools',
          stars: 23,
          language: 'Go',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '7',
          title: 'Private Work Project',
          url: 'https://github.com/company/secret-project',
          description: 'Internal company project for data processing',
          category: 'Work',
          stars: 0,
          language: 'Python',
          isPrivate: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '8',
          title: 'Learning Rust',
          url: 'https://github.com/learner/rust-journey',
          description: 'My journey learning Rust programming language',
          category: 'Learning',
          stars: 5,
          language: 'Rust',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        }
      ];
      setLinks(sampleLinks);
      localStorage.setItem('github-links', JSON.stringify(sampleLinks));
    }
  }, []);

  // Save links to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem('github-links', JSON.stringify(links));
  }, [links]);

  const addLink = (newLink: Omit<GitHubLink, 'id' | 'createdAt'>) => {
    const link: GitHubLink = {
      ...newLink,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLinks([...links, link]);
    setShowAddForm(false);
  };

  const updateLink = (updatedLink: GitHubLink) => {
    setLinks(links.map(link => link.id === updatedLink.id ? updatedLink : link));
    setEditingLink(null);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const filteredLinks = selectedCategory === 'all' 
    ? links 
    : links.filter(link => link.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(links.map(link => link.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <CategorySidebar 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  GitHub Link Manager
                </h1>
                <p className="text-slate-400">
                  Organize and manage your GitHub repositories and profiles
                </p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  onClick={() => window.location.href = '/quiz-platform'}
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Quiz Platform
                </Button>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-center">
                  <Github className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-white">{links.length}</p>
                    <p className="text-slate-400 text-sm">Total Links</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-slate-900 font-bold text-sm">★</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {links.reduce((sum, link) => sum + (link.stars || 0), 0)}
                    </p>
                    <p className="text-slate-400 text-sm">Total Stars</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">#</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
                    <p className="text-slate-400 text-sm">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Grid */}
            {filteredLinks.length === 0 ? (
              <div className="text-center py-16">
                <Github className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  No links found
                </h3>
                <p className="text-slate-500 mb-6">
                  {selectedCategory === 'all' 
                    ? "Start by adding your first GitHub link" 
                    : `No links in "${selectedCategory}" category`}
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={() => setEditingLink(link)}
                    onDelete={() => deleteLink(link.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingLink) && (
        <AddLinkForm
          link={editingLink}
          onSave={editingLink ? updateLink : addLink}
          onCancel={() => {
            setShowAddForm(false);
            setEditingLink(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
