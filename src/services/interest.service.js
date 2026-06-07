import { api } from "../utils/api";

export async function getInterest() {
  const response = await api.get("/interests");

  return response.data.data;
}
