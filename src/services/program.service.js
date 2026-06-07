import { api } from "../utils/api";

export async function getPrograms() {
  const response = await api.get("/programs");

  return response.data.data;
}
