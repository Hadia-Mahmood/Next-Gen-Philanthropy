import axios from "axios";
import apiUrl from "../utils/baseURL";
import Cookies from "js-cookie";

const token = typeof window !== "undefined" && Cookies.get("jwt");

class ComplainService {
  async complain(userData) {
    console.log("Hello");
    console.log(token);
    const res = await axios.post(
      `${apiUrl}/complaint/create-complaint`,
      userData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }

  async getComplaintsInDistrict(district) {
    const { data } = await axios.get(`${apiUrl}/get-all-complaints`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    return data; 
  }

  async deleteComplaintById(complaintId) {
    try {
      console.log("service");
      const response = await axios.delete(
        `${apiUrl}/complaint/delete-complaint/${complaintId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw (
        error.response.data.message ||
        "Something went wrong while deleting the complaint."
      );
    }
  }

  async addResponseToComplaint(complaintId, data) {
    try {
      console.log("IDDDDDDDDDDDDD");
      console.log(complaintId);
      console.log(data);
      const response = await axios.post(
        `${apiUrl}/complaint/add-response-to-a-complaint/${complaintId}`,
        data,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || "Internal server error");
    }
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new ComplainService();
