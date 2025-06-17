"use client";
import { GenerateHistory } from '@/lib/store/historyGenerateStore';
import { LuClock, LuEye } from 'react-icons/lu';

interface HistoryCardProps {
  history: GenerateHistory;
  onSelect: (history: GenerateHistory) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ history, onSelect }) => {
  const date = new Date(history.timestamp).toLocaleString();

  return (
    <div
      onClick={() => onSelect(history)}
      className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1 text-gray-600">
          <LuClock className="w-4 h-4" />
          <span className="text-sm">{date}</span>
        </div>
        <LuEye className="w-4 h-4 text-gray-400 hover:text-blue-600 transition" />
      </div>
      <pre
        className="text-xs text-gray-700 truncate"
        title={JSON.stringify(history.params)}
      >
        {JSON.stringify(history.params)}
      </pre>
    </div>
  );
};