import { extend } from "lodash";
import { useApi } from "../Api";
import { Exercise } from "../types/exercise";
import { BaseService } from "./base.service";

const api = useApi();

class ExerciseService extends BaseService<Exercise> {
  constructor() { 
    super("exercises");
  }

  importByFile(file: File) {
    const formData = new FormData();
    console.log("it came here");
    
    formData.append("file", file);
    return api.post("exercises/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  

}
export default ExerciseService;
