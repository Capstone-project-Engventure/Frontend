import { useApi } from "../Api";
import { Lesson } from "../types/lesson";
import { SubmissionResponse } from "../types/submission";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?: number;
  total_page?: number;
}

class SubmissionService extends BaseService<Lesson> {
  constructor() {
    super("submissions");
  }

  public async getSubmission(
    submissionId: string
  ): Promise<ApiResponse<Lesson>> {
    try {
      const res = await api.get(`${this.endpoint}/${submissionId}`);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data as Lesson,
        };
      } else {
        return {
          success: false,
          data: `Unexpected status code: ${res.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }

  public async getSubmissionsByExercise(
    exerciseId: string
  ): Promise<ApiResponse<SubmissionResponse[]>> {
    try {
      const res = await api.get(`${this.endpoint}?exercise=${exerciseId}`);
      if (res.status === 200) {
        return {
          success: true,
          data: res.data.results as SubmissionResponse[],
        };
      } else {
        return {
          success: false,
          data: `Unexpected status code: ${res.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }

  public async submitWritingExercise(
    exerciseId: string,
    content: string
  ): Promise<ApiResponse<SubmissionResponse>> {
    try {
      // Sending JSON instead of FormData:
      const payload = {
        exercise: exerciseId,
        content,
      };

      const res = await api.post(this.endpoint, payload);

      if (res.status === 201 || res.status === 200) {
        return {
          success: true,
          data: res.data as SubmissionResponse, // Return the actual response data from BE
        };
      } else {
        return {
          success: false,
          data: `Unexpected status code: ${res.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }
}

export default SubmissionService;
