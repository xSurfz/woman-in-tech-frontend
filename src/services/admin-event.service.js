import { api } from "../utils/api";

export async function getEvents() {
  const response = await api.get("/events");

  return response.data.data;
}

export async function createEvent(data) {
  const response = await api.post("/admin/events", data);

  return response.data.data;
}

export async function updateEvent(id, data) {
  const response = await api.patch(`/admin/events/${id}`, data);

  return response.data.data;
}

export async function deleteEvent(id) {
  await api.delete(`/admin/events/${id}`);
}
