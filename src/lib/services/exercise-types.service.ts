import { useApi } from "../Api";
import { ExerciseType } from "../types/exercise-type";
import { BaseService } from "./base.service";

const api = useApi();

class ExerciseTypeService extends BaseService<ExerciseType> {
 
  constructor() {
    super("exercises-types"); 
  }
}
export default ExerciseTypeService;
