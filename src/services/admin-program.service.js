import { api } from "../utils/api";

export async function getPrograms() {
  const response = await api.get("/admin/programs");
  return response.data.data;
}

export async function createProgram(data) {
  const response = await api.post("/admin/programs", data);
  return response.data.data;
}

export async function updateProgram(id, data) {
  const response = await api.patch(`/admin/programs/${id}`, data);
  return response.data.data;
}

export async function deleteProgram(id) {
  await api.delete(`/admin/programs/${id}`);
}