import { api } from "../utils/api";

export async function getCommunity() {
  const response = await api.get("/community");

  return response.data.data;
}
