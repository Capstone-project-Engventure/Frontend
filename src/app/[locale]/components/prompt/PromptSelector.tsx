import React, { useEffect, useState, useMemo } from 'react';
import { Prompt } from '@/lib/types/prompt';
import { usePromptStore } from '@/lib/store/promptStore';
import { 
  MdRefresh, 
  MdKeyboardArrowDown, 
  MdSearch,
  MdAutorenew,
  MdCode,
  MdHistory
} from 'react-icons/md';

interface PromptSelectorProps {
  selectedPrompt: Prompt | null;
  onPromptSelect: (prompt: Prompt | null) => void;
  onPromptContentChange: (content: string) => void;
  skill?: string;
  type?: string;
  className?: string;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({
  selectedPrompt,
  onPromptSelect,
  onPromptContentChange,
  skill,
  type,
  className = ""
}) => {
  const {
    prompts,
    recentPrompts,
    isLoading,
    error,
    fetchPrompts,
    fetchRecentPrompts,
    getPromptsBySkillAndType,
    setSelectedPrompt,
    clearError
  } = usePromptStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecentOnly, setShowRecentOnly] = useState(false);

  // Filter prompts based on search term and skill/type
  const filteredPrompts = useMemo(() => {
    let filtered = showRecentOnly ? recentPrompts : prompts;
    
    if (searchTerm) {
      filtered = filtered.filter(prompt => 
        prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [prompts, recentPrompts, searchTerm, showRecentOnly]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchPrompts(),
        fetchRecentPrompts()
      ]);
    };
    
    initializeData();
  }, [fetchPrompts, fetchRecentPrompts]);

  // Auto-select prompt based on skill and type
  useEffect(() => {
    const autoSelectPrompt = async () => {
      if (skill && type && !selectedPrompt) {
        const skillTypePrompts = await getPromptsBySkillAndType(skill, type);
        if (skillTypePrompts.length > 0) {
          const autoPrompt = skillTypePrompts[0];
          onPromptSelect(autoPrompt);
          onPromptContentChange(autoPrompt.content);
        }
      }
    };

    autoSelectPrompt();
  }, [skill, type, selectedPrompt, getPromptsBySkillAndType, onPromptSelect, onPromptContentChange]);

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    onPromptSelect(prompt);
    onPromptContentChange(prompt.content);
    setIsDropdownOpen(false);
  };

  const handleRefresh = async () => {
    await fetchPrompts(true);
    await fetchRecentPrompts();
  };

  const handleClearSelection = () => {
    setSelectedPrompt(null);
    onPromptSelect(null);
    onPromptContentChange('');
    setIsDropdownOpen(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with title and controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MdCode className="text-blue-500" />
          Prompt Templates
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecentOnly(!showRecentOnly)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
              showRecentOnly 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            title="Toggle recent prompts"
          >
            <MdHistory className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors duration-200 disabled:opacity-50"
            title="Refresh prompts"
          >
            <MdRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            <button
              onClick={() => {
                clearError();
                handleRefresh();
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700 font-medium text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Prompt Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <span className="flex items-center gap-2">
            {selectedPrompt ? (
              <>
                <span className="font-medium">{selectedPrompt.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({selectedPrompt.content.length} chars)
                </span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {isLoading ? 'Loading prompts...' : 'Select a prompt template'}
              </span>
            )}
          </span>
          <MdKeyboardArrowDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Prompt List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredPrompts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <MdAutorenew className="w-4 h-4 animate-spin" />
                      Loading prompts...
                    </div>
                  ) : (
                    showRecentOnly ? 'No recent prompts found' : 'No prompts found'
                  )}
                </div>
              ) : (
                <>
                  {/* Clear Selection Option */}
                  <button
                    onClick={handleClearSelection}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border-b border-gray-100 dark:border-gray-600"
                  >
                    <div className="font-medium text-gray-500 dark:text-gray-400 italic">
                      Clear selection
                    </div>
                  </button>

                  {filteredPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt)}
                      className={`w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 ${
                        selectedPrompt?.id === prompt.id 
                          ? 'bg-blue-100 dark:bg-blue-800' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {prompt.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {prompt.content.substring(0, 100)}...
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {prompt.use_few_shot && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded">
                            Few-shot
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {prompt.content.length} characters
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Prompt Info */}
      {selectedPrompt && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              {selectedPrompt.name}
            </h4>
            <div className="flex items-center gap-2">
              {selectedPrompt.use_few_shot && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded">
                  Few-shot enabled
                </span>
              )}
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {selectedPrompt.variables?.length || 0} variables
              </span>
            </div>
          </div>
          
          {selectedPrompt.variables && selectedPrompt.variables.length > 0 && (
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Variables: </span>
              {selectedPrompt.variables.map(v => v.name).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptSelector; 