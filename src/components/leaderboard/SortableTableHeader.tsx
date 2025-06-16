
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortField, SortConfig } from './types';

interface SortableTableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  field,
  children,
  sortConfig,
  onSort,
  className
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  return (
    <TableHead className={className}>
      <button 
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        {children}
        {getSortIcon(field)}
      </button>
    </TableHead>
  );
};

export default SortableTableHeader;
