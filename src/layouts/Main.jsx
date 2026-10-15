// rrd imports
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
// helper funtions
import { fetchData } from "../Wrapper.js";
// components
import NavbarBus from "../components/NavbarBus.jsx";


function Main() {
  // const { sCorreo, sPassword } = useLoaderData();
  // 🔐 Auth state (reactivo)
  const [isLogged, setIsLogged] = useState(false);

  // 📱 Detector de móvil
    const [isMobileBrowser, setIsMobileBrowser] = useState(false);
    const [showMobileBanner, setShowMobileBanner] = useState(true);

    useEffect(() => {
        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            window.innerWidth < 768;

        setIsMobileBrowser(isMobile);
        const checkAuth = () => {
          const correo = fetchData("correo");
          const pwd = fetchData("pwd");
          setIsLogged(!!correo && !!pwd);
        };
        // primera carga
        checkAuth();
        // escuchar cambios
        window.addEventListener("authChanged", checkAuth);
        return () => window.removeEventListener("authChanged", checkAuth);
    }, []);
  
  return (
    <>
      {!isLogged ? (
        <Outlet />
      ) : (
        <div className="relative">

          {/* 📱 Banner */}
          {/* {isMobileBrowser && showMobileBanner && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white shadow-xl rounded-2xl p-4 flex items-center justify-between z-50 animate-fade-in">
              <div>
                <p className="font-semibold text-gray-900">
                  ¿Tienes nuestra app móvil?
                </p>
                <p className="text-sm text-gray-600 -mt-1">
                  Descárgala para una mejor experiencia
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="bg-orange-600 text-white text-sm px-3 py-2 rounded-xl"
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.citafix.cita_fix"
                    )
                  }
                >
                  Descargar
                </button>

                <button
                  onClick={() => setShowMobileBanner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )} */}

          {/* Navbar */}
          <NavbarBus />

          <Outlet />
        </div>
      )}
    </>
  );
}

export default Main;
