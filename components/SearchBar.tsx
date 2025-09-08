'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TagPill } from './TagPill';

interface SearchBarProps {
  onSearch: (query: string, tags: string[]) => void;
  availableTags?: string[];
  placeholder?: string;
}

export function SearchBar({ 
  onSearch, 
  availableTags = [], 
  placeholder = "Search bookmarks..." 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (newQuery?: string, newTags?: string[]) => {
    const searchQuery = newQuery !== undefined ? newQuery : query;
    const searchTags = newTags !== undefined ? newTags : selectedTags;
    onSearch(searchQuery, searchTags);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    handleSearch(value, selectedTags);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    handleSearch(query, newTags);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setShowFilters(false);
    onSearch('', []);
  };

  const hasActiveFilters = query.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-input bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-islamic-green focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-2 text-muted hover:text-text transition-colors"
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 mr-1 transition-colors ${
              showFilters || selectedTags.length > 0
                ? 'text-islamic-green'
                : 'text-muted hover:text-text'
            }`}
            title="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted">Filtered by:</span>
          {selectedTags.map(tag => (
            <TagPill
              key={tag}
              tag={tag}
              active={true}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && availableTags.length > 0 && (
        <div className="glass-card p-4 rounded-card">
          <h3 className="text-sm font-medium text-text mb-3">Filter by tags:</h3>
          
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <TagPill
                key={tag}
                tag={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
          
          {availableTags.length === 0 && (
            <p className="text-sm text-muted">No tags available</p>
          )}
        </div>
      )}

      {/* Search Stats */}
      {hasActiveFilters && (
        <div className="text-sm text-muted">
          {query && `Searching for "${query}"`}
          {query && selectedTags.length > 0 && ' with '}
          {selectedTags.length > 0 && `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  );
}
