import { extend } from "lodash";
import { useApi } from "../Api";
import { Course } from "../types/course";
import { BaseService } from "./base.service";

const api = useApi();

interface ApiResponse<T> {
  success: boolean;
  data: T | string;
  current_page?: number;
  total_page?: number;
}

class CourseService extends BaseService<Course> {
  constructor() {
    super("courses");
  }
}
export default CourseService;
