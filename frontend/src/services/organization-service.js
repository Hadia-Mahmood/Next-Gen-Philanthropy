import axios from "axios";
import apiUrl from "../utils/baseURL";
import Cookies from "js-cookie";

const token = typeof window !== "undefined" && Cookies.get("jwt");

class AdminService { 
    async getOrganizationStatistics() {
        const { data } = await axios.get(`${apiUrl}/organization/get-organization-statistics`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 
    
    async getUserStatistics() {
        const { data } = await axios.get(`${apiUrl}/organization/get-user-statistics`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      }
    
    async getTopDonors() {
        const { data } = await axios.get(`${apiUrl}/organization/get-top-donors`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      }
      
    async getWaitingApplications() {
        const { data } = await axios.get(`${apiUrl}/organization/get-waiting-application`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 
 
    async getApplicationById(applicationId) {
        const { data } = await axios.post(`${apiUrl}/organization/getApplicationById`, 
          { applicationId },
          {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 

    async applicationApproval(data) {

        const res = await axios.post(
          `${apiUrl}/organization/updateApplicationApproval`,
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

    async getWaitingBreakdownProof() {
        const { data } = await axios.get(`${apiUrl}/organization/get-waiting-breakdown-proof`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 

    async getBreakdownProofById(breakdownProofId) {
        const { data } = await axios.post(`${apiUrl}/organization/getBreakdownProofById`, 
          { breakdownProofId },
          {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 
      
    async updateProofStatus(data) {

        const res = await axios.post(
          `${apiUrl}/organization/updateProofStatus`,
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
    
    async getApprovedApplications() {
        const { data } = await axios.get(`${apiUrl}/organization/get-approved-application`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        return data;
      } 

    async updateDonorNFT(data) {

        const res = await axios.post(
          `${apiUrl}/organization/updateDonorNFT`,
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
    
      
}


// eslint-disable-next-line import/no-anonymous-default-export
export default new AdminService();


