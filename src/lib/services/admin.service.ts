import { useApi } from "../Api";
import { Stats } from "../types/stats";
import { BaseService } from "./base.service";

const api = useApi();
class AdminService extends BaseService<Stats> {
  constructor() {
    super("administrators");
  }

  async getStats(): Promise<Stats> {
    const response = await api.get<Stats>(`/administrators/stats`);
    return response.data;
  }
}
export default AdminService;
