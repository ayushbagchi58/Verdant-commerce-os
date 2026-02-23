import { AxiosResponse } from "axios";
import { ENDPOINTS } from "../End_point";
import axiosInstance from "../Instance/axiosInstance";

export interface AddProductPayload {
  title: string;
  price: number;
  rating:number;
  description: string;
  image: string;
  category: string;
}

export const addProduct = async (
  data: AddProductPayload
): Promise<AxiosResponse<AddProductPayload>> => {
  return await axiosInstance.post(ENDPOINTS.PRODUCTS, data);
};