
import { redirect } from "react-router-dom";
import { deleteItem } from "../Wrapper.js";
import { toast } from "react-toastify";
import { urlApi } from "../styles/Constants.jsx";

export async function logoutAction() {

    // 1. Eliminar cookie JWT del servidor
    try {
        const response = await fetch(`${urlApi}auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            console.warn("No se pudo cerrar la sesión en el servidor");
        }
    } catch (error) {
        console.error("Error cerrando sesión:", error);
    }

    // 2. Limpiar sesión local
    deleteItem({ key: "correo" });
    deleteItem({ key: "pwd" });
    deleteItem({ key: "dorsl" });
    deleteItem({ key: "UserCitaFix" });
    deleteItem({ key: "homeBusiness" });

    // 3. Actualizar estado de autenticación
    window.dispatchEvent(new Event("authChanged"));

    toast.success("¡Regresa pronto!");

    return redirect("/");
}
