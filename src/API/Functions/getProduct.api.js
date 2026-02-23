import { ENDPOINTS } from "../End_point";
import axiosInstance from "../Instance/axiosInstance";
export const getProduct = async () => {
    return await axiosInstance.get(ENDPOINTS.PRODUCTS);
};
