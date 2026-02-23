import { ENDPOINTS } from "../End_point";
import axiosInstance from "../Instance/axiosInstance";
export const addProduct = async (data) => {
    return await axiosInstance.post(ENDPOINTS.PRODUCTS, data);
};
