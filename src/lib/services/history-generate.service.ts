import { useApi } from "../Api";
import { GenerateHistory } from "../types/history-generate";
import { BaseService } from "./base.service";


class HistoryGenerateService extends BaseService<GenerateHistory>{
  constructor() {
    super("history-generate");
  }
}
export default HistoryGenerateService;
