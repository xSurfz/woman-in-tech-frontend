import { api } from "../utils/api";

export async function getTestimonials() {
  const response = await api.get(
    "/admin/testimonials"
  );

  return response.data.data;
}

export async function createTestimonial(data) {
  const response = await api.post(
    "/admin/testimonials",
    data,
  );

  return response.data.data;
}

export async function updateTestimonial(
  id,
  data,
) {
  const response = await api.patch(
    `/admin/testimonials/${id}`,
    data,
  );

  return response.data.data;
}

export async function deleteTestimonial(id) {
  await api.delete(
    `/admin/testimonials/${id}`,
  );
}