
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Ubicacion() {
  const { id } = useParams();

  useEffect(() => {
    const abrirUbicacion = async () => {
      try {
        const response = await fetch(
          `https://api.plannersday.com/api/ubicacion/${id}`
        );

        if (!response.ok) {
          throw new Error("No se encontró el negocio");
        }

        const json = await response.json();

        if (!json.success) {
          throw new Error("Ubicación no disponible");
        }

        const { latitude, longitude } = json.data;

        const urlMaps = new URL(
          "https://www.google.com/maps/search/"
        );

        urlMaps.searchParams.set("api", "1");
        urlMaps.searchParams.set(
          "query",
          `${latitude},${longitude}`
        );

        window.location.replace(urlMaps.toString());

      } catch (error) {
        console.error("Error:", error);
      }
    };

    abrirUbicacion();
  }, [businessId]);

  return <p>Abriendo Google Maps...</p>;
}
