import { useState } from 'react';
import ExerciseService from '../services/exercise.service';
import LessonService from '../services/lesson.service';
import { Exercise } from '../types/exercise';

const exerciseService = new ExerciseService();
const lessonService = new LessonService();

export const useDeployExercise = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishExercises = async (exerciseIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.publishExercises(exerciseIds);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to publish exercises');
      }
    } catch (err: any) {
      setError(err.message || 'Error publishing exercises');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unpublishExercises = async (exerciseIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.unpublishExercises(exerciseIds);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to unpublish exercises');
      }
    } catch (err: any) {
      setError(err.message || 'Error unpublishing exercises');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignExercisesToLesson = async (exerciseIds: number[], lessonId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.assignExercisesToLesson(exerciseIds, lessonId);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to assign exercises to lesson');
      }
    } catch (err: any) {
      setError(err.message || 'Error assigning exercises to lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPublishedExercises = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.getPublishedExercises(filters);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch published exercises');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching published exercises');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDeploymentStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.getDeploymentStats();
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch deployment stats');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching deployment stats');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await lessonService.getAll();
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch lessons');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching lessons');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkDeployToLesson = async (
    exerciseIds: number[], 
    lessonId: number, 
    publishImmediately: boolean = true
  ) => {
    setLoading(true);
    setError(null);
    try {
      // First assign to lesson
      await assignExercisesToLesson(exerciseIds, lessonId);
      
      // Then publish if requested
      if (publishImmediately) {
        await publishExercises(exerciseIds);
      }
      
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error deploying exercises to lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    publishExercises,
    unpublishExercises,
    assignExercisesToLesson,
    getPublishedExercises,
    getDeploymentStats,
    getAllLessons,
    bulkDeployToLesson,
  };
}; 