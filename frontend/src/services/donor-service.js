import axios from "axios";
import apiUrl from "../utils/baseURL";
import Cookies from "js-cookie";

const token = typeof window !== "undefined" && Cookies.get("jwt");

class DonorService { 
    
        async getDonorStatistics(userId) {
            const { data } = await axios.post(
              `${apiUrl}/donor/donationStatistics`,
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
        async getDonorCampaigns(userId) {
            const { data } = await axios.post(
              `${apiUrl}/donor/donatedCampaigns`,
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

        async getDonorData(userId) {
            const { data } = await axios.post(
              `${apiUrl}/donor/getDonorData`,
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


        async fundCampaign(data) {

            const res = await axios.post(
              `${apiUrl}/donor/donatedToCampaign`,
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
        async getDonorCollection(userId) {
            const { data } = await axios.post(
              `${apiUrl}/donor/userCollection`,
              { userId }, 
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


export default new DonorService();


