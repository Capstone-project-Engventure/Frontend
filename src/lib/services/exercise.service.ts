import { extend } from "lodash";
import { useApi } from "../Api";
import { Exercise } from "../types/exercise";
import { BaseService } from "./base.service";

const api = useApi();

class ExerciseService extends BaseService<Exercise> {
  constructor() { 
    super("exercises");
  }

  

}
export default ExerciseService;
