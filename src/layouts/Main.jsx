
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchData, deleteItem } from "../Wrapper.js";
import { urlApi } from "../styles/Constants.jsx";
import NavbarBus from "../components/NavbarBus.jsx";

function Main() {
  const location = useLocation();

  const [isLogged, setIsLogged] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      setCheckingAuth(true);

      const correo = fetchData("correo");

      if (!correo) {
        if (active) {
          setIsLogged(false);
          setCheckingAuth(false);
        }
        return;
      }

      try {
        const response = await fetch(`${urlApi}auth/me`, {
          method: "GET",
          credentials: "include"
        });

        if (!active) return;

        if (response.status === 401) {
          deleteItem({ key: "correo" });
          deleteItem({ key: "pwd" });
          deleteItem({ key: "dorsl" });
          deleteItem({ key: "UserCitaFix" });
          deleteItem({ key: "homeBusiness" });

          setIsLogged(false);
        } else if (response.ok) {
          setIsLogged(true);
        } else {
          console.error("Error validando sesión:", response.status);
          setIsLogged(false);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        if (active) setIsLogged(false);
      } finally {
        if (active) setCheckingAuth(false);
      }
    };

    checkAuth();

    window.addEventListener("authChanged", checkAuth);

    return () => {
      active = false;
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  if (!isLogged && !isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isLogged ? (
        <div className="relative">
          <NavbarBus />
          <Outlet context={{ isLogged }} />
        </div>
      ) : (
        <Outlet context={{ isLogged }} />
      )}
    </>
  );
}

export default Main;
