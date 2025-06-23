import { Course } from "../types/course";
import { BaseService } from "./base.service";

class CourseService extends BaseService<Course> {
  constructor() {
    super("courses");
  }
}

const courseService = new CourseService()
export default courseService;
