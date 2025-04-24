import axios from "axios";
import apiUrl from "../utils/baseURL";
import Cookies from "js-cookie";

const token = typeof window !== "undefined" && Cookies.get("jwt");
 
class BeneficiaryEntry {
  async createApplication(data) {

    const res = await axios.post(
      `${apiUrl}/beneficiary/create-beneficiary-application`,
      data,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }
  async getApplicationData(userId) {
    const { data } = await axios.post(
      `${apiUrl}/beneficiary/getApplicationData`,
      { userId }, // Send userId in the body
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
  async getAllApplicationData(userId) {
    const { data } = await axios.post(
      `${apiUrl}/beneficiary/getAllApplicationData`,
      { userId }, // Send userId in the body
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
  async unlockMilestoneId(userId) {

    const { data }  = await axios.post(
      `${apiUrl}/beneficiary/unlock-need-id`,
      {userId},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }

   
  async unlockMilestone(data) {

    const res = await axios.post(
      `${apiUrl}/beneficiary/unlock-milestone`,
      data,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }
  

  async getProgressReport(applicationId) {
    const { data } = await axios.post(
      `${apiUrl}/beneficiary/getProgressReport`,
      { applicationId }, // Send applicationId in the body
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }

  async getBreakdownProof(breakdownId) {
    const { data } = await axios.post(
      `${apiUrl}/beneficiary/getBreakdownProof`,
      { breakdownId }, // Send breakdownId in the body
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
  
}


// eslint-disable-next-line import/no-anonymous-default-export
export default new BeneficiaryEntry();


