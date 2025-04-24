import axios from "axios";
import apiUrl from "../utils/baseURL";
import Cookies from "js-cookie";

const token = typeof window !== "undefined" && Cookies.get("jwt");
 
class ImageService {
  
   
    

   
  async uploadImage(data) {
    console.log("my datttta", data);
    const res = await axios.post(
      `${apiUrl}/ipfs/uploadImage`,
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
export default new ImageService();




















