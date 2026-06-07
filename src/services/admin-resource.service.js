import { api } from "../utils/api";

export async function getResources() {
  const response = await api.get("/admin/resources");

  return response.data.data;
}

export async function createResource(data) {
  const response = await api.post(
    "/admin/resources",
    data,
  );

  return response.data.data;
}

export async function updateResource(id, data) {
  const response = await api.patch(
    `/admin/resources/${id}`,
    data,
  );

  return response.data.data;
}

export async function deleteResource(id) {
  await api.delete(`/admin/resources/${id}`);
}