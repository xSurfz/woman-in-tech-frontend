import { api } from "../utils/api";

export async function getEvents() {
  const response = await api.get("/events");

  return response.data.data;
}
