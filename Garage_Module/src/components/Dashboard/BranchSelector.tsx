import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { Branch } from '../../types';

interface BranchSelectorProps {
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  branches: Branch[];
  isDarkMode?: boolean;
}

export default function BranchSelector({ 
  selectedBranch, 
  onBranchChange, 
  branches, 
  isDarkMode = false 
}: BranchSelectorProps) {
  const selectedBranchName = selectedBranch === 'all' 
    ? 'All Branches' 
    : branches.find(b => b.id === selectedBranch)?.name || 'Unknown Branch';

  return (
    <div className="relative">
      <label className={`block text-sm font-medium mb-2 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Branch Filter
      </label>
      <div className="relative">
        <select
          value={selectedBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          className={`appearance-none w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.location}
            </option>
          ))}
        </select>
        
        <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
      
      {selectedBranch !== 'all' && (
        <div className={`mt-2 text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Viewing: {selectedBranchName}
        </div>
      )}
    </div>
  );
}