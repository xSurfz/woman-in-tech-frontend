import { api } from "../utils/api";

export async function getResources() {
  const response = await api.get("/resources");

  return response.data.data;
}
