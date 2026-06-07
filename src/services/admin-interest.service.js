import { api } from "../utils/api";

export async function getInterests() {
  const response =
    await api.get("/admin/interests");

  return response.data.data;
}

export async function createInterest(data) {
  const response =
    await api.post("/admin/interests", data);

  return response.data.data;
}

export async function updateInterest(id, data) {
  const response =
    await api.patch(
      `/admin/interests/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteInterest(id) {
  await api.delete(
    `/admin/interests/${id}`,
  );
}