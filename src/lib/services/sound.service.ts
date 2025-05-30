
import { useApi } from "../Api";
import { Sound } from "../types/sound";
import { BaseService } from "./base.service";

const api = useApi();
class SoundService extends BaseService<Sound> {
  constructor() {
    super("sounds");
  }

  importByFile(file: File) {
    const formData = new FormData();
 
    formData.append("file", file);
    return api.post("/sounds/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
export default SoundService