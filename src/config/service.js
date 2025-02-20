import axios from "axios";
import ApiConfig from "./apiconfig";


export const apiRequest = async (method, endPoint, query, data) => {
  try {
    const res = await axios({
      method,
      url: ApiConfig[endPoint],
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: query,
      data,
    });
    if (res.data?.responseCode === 200 || res.data?.responseCode === 201) {
      return res.data;
    }
  } catch (error) {
    console.log(`Error while calling ${endPoint} API`, error);
    return error?.response?.data;
  }
};