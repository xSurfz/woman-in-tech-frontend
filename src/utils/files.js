const API_URL = "http://localhost:3000";

export function getFileUrl(path) {
  if (!path) return null;

  return `${API_URL}${path}`;
}