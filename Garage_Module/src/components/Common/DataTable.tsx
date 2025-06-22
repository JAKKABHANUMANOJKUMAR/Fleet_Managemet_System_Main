import React, { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: any) => void;
  isDarkMode?: boolean;
}

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  onRowClick,
  isDarkMode = false
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(row =>
    searchTerm === '' ||
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={`rounded-xl shadow-sm border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      {searchable && (
        <div className={`p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button className={`p-2 border rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-600 hover:bg-gray-700 text-gray-400' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-500'
            }`}>
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                    column.sortable ? 'cursor-pointer hover:bg-opacity-80' : ''
                  } ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 divide-gray-700' 
              : 'bg-white divide-gray-200'
          }`}>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${
                  isDarkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No data found</p>
        </div>
      )}
    </div>
  );
}