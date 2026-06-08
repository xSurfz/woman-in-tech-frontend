export const fetchEvents = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events.json`);

    if (!response.ok) throw new Error("Error cargando eventos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { upcoming: [], past: [] };
  }
};

export const fetchPrograms = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/programs.json`,
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo cargar programas`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchPrograms:", error);
    return [];
  }
};

export const fetchCommunity = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/community.json`,
    );
    if (!response.ok) throw new Error("Error cargando comunidad");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return {
      leaders: [],
      members: [],
    };
  }
};

export const fetchTestimonials = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/testimonials.json`,
    );
    if (!res.ok) throw new Error("Error testimonials");
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchResources = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/resources.json`,
    );
    if (!response.ok) throw new Error("Error cargando recursos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    credentials: "include", // 🔥 clave para cookies JWT
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}

import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});
