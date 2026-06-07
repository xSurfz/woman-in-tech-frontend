import { api } from "../utils/api";

export async function getTestimonials() {
  const response = await api.get("/testimonials");

  return response.data.data;
}
