import axios, { type AxiosError } from "axios";
import type { ErrorResponseDTO } from "../types/error";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para procesar respuestas de error de forma centralizada.
apiClient.interceptors.response.use(
  // Si la respuesta es exitosa (2xx), la devuelve sin más.
  (response) => response,
  // Si hay un error, lo procesamos aquí.
  (error: AxiosError<ErrorResponseDTO>) => {
    // Verificamos si el error viene del backend con nuestro formato esperado.
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    if (error.response && error.response.status === 401) {
      return Promise.reject(new Error("No autorizado. Por favor inicia sesión."));
    }

    if (error.response && error.response.status === 403) {
      return Promise.reject(new Error("No tienes permisos suficientes para realizar esta acción."));
    }

    // Fallback para errores de red u otros problemas no controlados por el backend.
    return Promise.reject(new Error("Ocurrió un error de red o en el servidor. Intenta de nuevo más tarde."));
  }
);
