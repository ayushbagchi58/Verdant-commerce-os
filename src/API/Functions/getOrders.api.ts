import { ENDPOINTS } from "../End_point"
import axiosInstance from "../Instance/axiosInstance"

export const getOrders =async() =>{
    return await axiosInstance.get(ENDPOINTS.CART)
}
  