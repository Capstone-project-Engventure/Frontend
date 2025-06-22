import React from 'react';
import { Exercise } from '@/lib/types/exercise';

interface ExerciseApprovalCardProps {
  exercise: Exercise;
  status: 'pending' | 'approved' | 'rejected' | 'exists';
  onApprove: (exercise: Exercise) => void;
  onReject: (exercise: Exercise, reason?: string) => void;
  loading?: boolean;
}

const ExerciseApprovalCard: React.FC<ExerciseApprovalCardProps> = ({
  exercise,
  status,
  onApprove,
  onReject,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'exists':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã phê duyệt';
      case 'rejected':
        return 'Đã từ chối';
      case 'exists':
        return 'Đã tồn tại';
      default:
        return 'Chờ phê duyệt';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="mb-3">
        <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
        <p className="text-gray-600 text-sm mb-2">{exercise.question}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Kỹ năng: {exercise.skill}</span>
          <span>•</span>
          <span>Cấp độ: {exercise.level}</span>
          {exercise.type && (
            <>
              <span>•</span>
              <span>Loại: {exercise.type.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Trạng thái:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>

        {status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(exercise)}
              disabled={loading}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Phê duyệt'}
            </button>
            <button
              onClick={() => onReject(exercise, 'Không phù hợp')}
              disabled={loading}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Từ chối'}
            </button>
          </div>
        )}

        {status === 'exists' && (
          <span className="text-sm text-yellow-600 flex items-center gap-1">
            <span>⚠️</span>
            <span>Đã tồn tại trong hệ thống</span>
          </span>
        )}

        {status === 'approved' && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <span>✅</span>
            <span>Đã được phê duyệt</span>
          </span>
        )}

        {status === 'rejected' && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <span>❌</span>
            <span>Đã bị từ chối</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ExerciseApprovalCard; 