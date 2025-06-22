import { axiosInstance } from "../Api";
class UserService {
  async getOwnUser() {
    try {
      const res = await axiosInstance.get("/users/user_info");
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }
}
export default UserService;
