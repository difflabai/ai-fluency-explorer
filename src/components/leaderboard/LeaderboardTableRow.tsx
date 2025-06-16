
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Medal, Calendar, Database, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { SavedTestResult } from '@/services/testResultService';
import { SortConfig } from './types';

interface LeaderboardTableRowProps {
  entry: SavedTestResult;
  index: number;
  sortConfig: SortConfig;
}

const LeaderboardTableRow: React.FC<LeaderboardTableRowProps> = ({
  entry,
  index,
  sortConfig
}) => {
  return (
    <TableRow 
      className={`
        cursor-pointer hover:bg-gray-50 transition-colors
        ${entry.is_test_data 
          ? "bg-blue-50 hover:bg-blue-100" 
          : index < 3 
            ? "bg-purple-50 hover:bg-purple-100" 
            : "hover:bg-gray-50"
        }
      `}
    >
      <TableCell>
        <div className="flex items-center">
          {sortConfig.field === 'rank' && sortConfig.direction === 'asc' && index < 3 ? (
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full 
              ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                index === 1 ? "bg-gray-100 text-gray-600" : 
                "bg-amber-100 text-amber-600"}
            `}>
              <Medal className="h-4 w-4" />
            </div>
          ) : (
            <span className="text-gray-500 font-medium">{index + 1}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
            {entry.is_test_data ? (
              <Database className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-purple-600" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
              {entry.username || "Anonymous User"}
              {entry.is_test_data && (
                <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                  Test
                </span>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-900 font-semibold">{entry.overall_score}</div>
        <div className="text-xs text-gray-500">of {entry.max_possible_score}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${entry.tier_name === 'Expert' ? 'bg-purple-100 text-purple-800' :
            entry.tier_name === 'Proficient' ? 'bg-blue-100 text-blue-800' :
            entry.tier_name === 'Competent' ? 'bg-green-100 text-green-800' :
            entry.tier_name === 'Advanced Beginner' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'}
        `}>
          {entry.tier_name}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(new Date(entry.created_at), 'MMM d, yyyy')}
          <span className="text-xs ml-1">
            ({format(new Date(entry.created_at), 'HH:mm')})
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Link to={`/shared/${entry.share_id}`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default LeaderboardTableRow;
