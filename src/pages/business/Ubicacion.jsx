
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Ubicacion() {
  const { id } = useParams();

  useEffect(() => {
    if (!/^[1-9]\d*$/.test(id ?? "")) {
      return;
    }

    const url = new URL(
      "https://api.plannersday.com/api/ubicacion"
    );

    url.searchParams.set("bussiness_id", id);

    window.location.replace(url.toString());
  }, [id]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Abriendo ubicación en Google Maps...</p>
    </div>
  );
}
