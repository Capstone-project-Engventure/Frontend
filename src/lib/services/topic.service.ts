import { useApi } from "../Api";
import { Topic } from "../types/topic";
import { BaseService } from "./base.service";


class TopicService extends BaseService<Topic>{
  constructor() {
    super("topics");
  }
}
export default TopicService;
