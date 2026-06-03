import { api } from "../utils/api";

export async function getMembers() {
  const response = await api.get("/admin/members");
  return response.data.data;
}

export async function createMember(data) {
  const response = await api.post("/admin/members", data);
  return response.data.data;
}

export async function updateMember(id, data) {
  const response = await api.patch(`/admin/members/${id}`, data);
  return response.data.data;
}

export async function deleteMember(id) {
  await api.delete(`/admin/members/${id}`);
}