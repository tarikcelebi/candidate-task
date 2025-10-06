import axios from "axios";
import { Address } from "./types/address";

const API = axios.create({
  baseURL: "http://localhost:5001/api/addresses",
});

export const getAddresses = async (): Promise<Address[]> => {
  try {
    console.log("girdiii");
    const res = await API.get<Address[]>("/");
    console.log("Axios response:", res); // 🔹 log full response
    return res.data;
  } catch (err) {
    console.error("getAddressesErr", err);
    throw err;
  }
};
export const addAddress = (data: Omit<Address, "_id">) => API.post("/", data);
export const updateAddress = (id: string, data: Partial<Address>) =>
  API.put(`/${id}`, data);
export const deleteAddress = (id: string) => API.delete(`/${id}`);
export const bulkImport = (text: string) => API.post("/bulk", { text });
