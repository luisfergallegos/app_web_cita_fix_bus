
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import SingIn from "./authenticate/SignIn.jsx";
import Workspaces from "./business/Workspaces.jsx";

import { urlApi } from "../styles/Constants.jsx";
import { fetchData } from "../Wrapper.js";

// Loader: conserva su exportación porque App.jsx lo utiliza
export function loginFormLoader() {
    return null;
}

export function LoginForm() {

    // Estado JWT validado por Main.jsx
    const { isLogged } = useOutletContext();

    useEffect(() => {

        // No consultar datos de usuario sin sesión válida
        if (!isLogged) return;

        const controller = new AbortController();

        const fData = async () => {

            // Obtener datos actuales después de validar la sesión
            const sCorreo = fetchData("correo");
            const slastSession = fetchData("lastsession");
            const sUserCitaFix = fetchData("UserCitaFix") ?? [];
            const userId = sUserCitaFix.USER_ID ?? "";

            if (!sCorreo || !userId) return;

            const options = {
                method: "GET",
                credentials: "include",
                signal: controller.signal,
                headers: {
                    Accept: "application/json"
                }
            };

            // =====================================
            // 1. Última sesión
            // =====================================

            const now = new Date();

            const today = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0")
            ].join("-");

            if (today !== slastSession) {

                try {
                    const response = await fetch(
                        `${urlApi}userLastSession?email=${encodeURIComponent(sCorreo)}`,
                        options
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    localStorage.setItem(
                        "lastsession",
                        JSON.stringify(today)
                    );

                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error("Error actualizando última sesión:", error);
                    }
                }
            }

            // =====================================
            // 2. Notificaciones
            // =====================================

            try {

                const response = await fetch(
                    `${urlApi}notification?userid=${encodeURIComponent(userId)}`,
                    options
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const json = await response.json();

                const notificaciones = Array.isArray(json.data)
                    ? json.data
                    : [];

                // =====================================
                // 3. Invitaciones de colaboradores
                // =====================================

                const responseCol = await fetch(
                    `${urlApi}usrInfCol?user_id=${encodeURIComponent(userId)}`,
                    options
                );

                if (!responseCol.ok) {
                    throw new Error(`HTTP ${responseCol.status}`);
                }

                const jsonCol = await responseCol.json();

                const colaboradores = Array.isArray(jsonCol.data)
                    ? jsonCol.data
                    : [];

                const pendientes = colaboradores.filter(
                    item => Number(item.CONFIRM) === 0
                ).length;

                localStorage.setItem(
                    "numNot",
                    String(pendientes + notificaciones.length)
                );

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error consultando notificaciones:", error);
                }
            }
        };

        fData();

        return () => {
            controller.abort();
        };

    }, [isLogged]);

    return isLogged ? (
        <Workspaces />
    ) : (
        <div id="containerLogin">
            <div className="containerLogin">
                <SingIn />
            </div>
        </div>
    );
}

export default LoginForm;
