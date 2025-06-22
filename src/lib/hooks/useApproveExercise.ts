import { useState } from 'react';
import ExerciseService from '../services/exercise.service';
import { Exercise } from '../types/exercise';

const exerciseService = new ExerciseService();

export const useApproveExercise = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkExerciseExists = async (exerciseData: Partial<Exercise>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.checkExerciseExists(exerciseData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error checking exercise existence');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveExercise = async (exerciseData: Exercise) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.approveExercise(exerciseData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error approving exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPendingExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.getPendingExercises();
      return result;
    } catch (err: any) {
      setError(err.message || 'Error fetching pending exercises');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectExercise = async (exerciseId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.rejectExercise(exerciseId, reason);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error rejecting exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkExerciseExists,
    approveExercise,
    getPendingExercises,
    rejectExercise,
  };
}; 