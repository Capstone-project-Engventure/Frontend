import { useApi } from "../Api";
import { Lesson } from "../types/lesson";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?: number;
  total_page?: number;
}

class LessonService extends BaseService<Lesson> {
  constructor() {
    super("lessons");
  }
}

export default LessonService;
