import { useState } from 'react';

type Exercise = {
  options: string[];
  // Add other properties if needed
};

function OrderingQuestion({ exercise }: { exercise: Exercise }) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (item: any) => {
    if (selected.includes(item)) return; // tránh chọn lại
    setSelected([...selected, item]);
  };

  const handleReset = () => setSelected([]);

  return (
    <div className="space-y-4 mt-4">
      {/* Phần hiển thị câu trả lời đang được sắp xếp */}
      <div className="min-h-[40px] border-b border-gray-500 pb-2 flex flex-wrap gap-2">
        {selected.map((item, idx) => (
          <div
            key={idx}
            className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Các tùy chọn để chọn */}
      <div className="flex flex-wrap gap-3">
        {exercise.options.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSelect(item)}
            className={`px-4 py-2 rounded-xl border border-gray-400 text-white bg-gray-800 text-sm ${
              selected.includes(item) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
            }`}
            disabled={selected.includes(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Nút reset */}
      <button
        onClick={handleReset}
        className="mt-2 px-4 py-1 rounded-md bg-red-500 text-white text-sm"
      >
        Reset
      </button>
    </div>
  );
}
