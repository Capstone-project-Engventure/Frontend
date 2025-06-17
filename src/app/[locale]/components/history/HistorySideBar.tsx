"use client";
import React, { useEffect } from 'react';
import { GenerateHistory, useHistoryGenerateStore } from '@/lib/store/historyGenerateStore';
import { HistoryCard } from './HistoryCard';

interface HistorySidebarProps {
  onClose: () => void;
}


const HistorySidebar: React.FC<HistorySidebarProps> = ({ onClose }) => {
  const { histories, fetchHistories } = useHistoryGenerateStore();
  const addHistory = useHistoryGenerateStore((s) => s.addHistory);
  const setResults = useHistoryGenerateStore((s) => s.addHistory); // placeholder

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  const handleSelect = (h: GenerateHistory) => {
    // update generate results in the main store
    useHistoryGenerateStore.setState({ histories: histories });
    // TODO: call a callback or dispatch to set exercises in generate store
    // e.g. useGenerateStore.getState().setResults(h.exercises);
    onClose();
  };

  return (
    <aside className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Generate History</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="p-4 space-y-4">
        {histories.length === 0 ? (
          <p className="text-gray-500 italic">No history yet.</p>
        ) : (
          histories.map((h) => (
            <HistoryCard key={h.id} history={h} onSelect={handleSelect} />
          ))
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
