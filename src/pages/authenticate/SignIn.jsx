
import { useState, useEffect } from 'react';
import { urlApi } from '../../styles/Constants';
import { toast } from "react-toastify";
import { useNavigate, useLoaderData } from "react-router-dom";
// assents
import Logo from "../../assets/menu.png";
// helper funtions
import { fetchData } from "../../Wrapper.js";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Loaging from '../../components/Loading.jsx';

export function loginLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

export function Login() {
  const { sCorreo, sPassword } = useLoaderData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertConfirmation, setshowAlertConfirmation] = useState(false);
  const [showAlertWarn, setshowAlertWarn] = useState(false);
  const [showAlertWarnMessage, setshowAlertWarnMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    //ValidateEmail
    const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (email == '' || password == '') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
      return;
    }
    else if (!isValidEmail.test(email)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
      return;
    }

    setLoading(true);
    var options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-citafix-ps': password
      }
    }
    try {
      const response = await fetch(`${urlApi}login?email=${email}`, options);
      if (response.status == 404) {
        setLoading(false);
        return toast.error(`Usuario no registrado`);
      }
      if (response.status == 401) {
        setLoading(false);
        return toast.error(`Contraseña incorrecta`);
      }
      if (response.status == 500) {
        setLoading(false);
        return toast.error(`Error en el servidor, intenta más tarde`);
      }

      const json = await response.json();
      if (json['sucess']) {
        localStorage.setItem("correo", '');
        localStorage.setItem("pwd", '');
        // localStorage.setItem("tokenH", '');
        // localStorage.setItem("BusinessCitaFix", '');
        localStorage.setItem("UserCitaFix", '');

        localStorage.setItem("correo", JSON.stringify(email));
        localStorage.setItem("pwd", JSON.stringify(password));
        try {
          const response = await fetch(`${urlApi}usr?email=${email}`, options);
          if (!response.ok) {
            toast.error(`No se puede obtener la información del usuario`);
            setLoading(false);
            return;
          }
          const json = await response.json();
          //obtener nombre
          localStorage.setItem("UserCitaFix", JSON.stringify(json['data']));
          var userName = json['data']['first_name'];
          var dorsl = json['data']['DORSL'];
          localStorage.setItem("dorsl", JSON.stringify(dorsl));
          window.dispatchEvent(new Event("authChanged"));
          navigate('/', { replace: true }); // <-- redirect
          setLoading(false);
          return toast.success(`Bienvenido, ${userName}`);
        }
        catch (e) {
          setLoading(false);
          return;
        }
      }

    } catch (e) {
      setLoading(false);
      return;
    }

  };

  const signInAction = async () => {
    //ValidateEmail
    const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email == "") {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
      return;
    } else if (!isValidEmail.test(email)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
      return;
    }
    else {
      try {
        const response = await fetch(`${urlApi}forgot?email=${email}`);
        if (response.status == 200) {
          setshowAlertConfirmation(true);
          setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
        }
        else if (response.status == 404) {
          setshowAlertWarnMessage(`No se encontró Usuario con el email ingresado`);
          setshowAlertWarn(true);
          setTimeout(() => setshowAlertWarn(false), 3000); // ocultar alerta
        }
        else {
          setshowAlertWarnMessage(`Algo salió mal... Error inesperado.`);
          setshowAlertWarn(true);
          setTimeout(() => setshowAlertWarn(false), 3000); // ocultar alerta
        }
      }
      catch (e) {
        return;
      }
    }

  };

  useEffect(() => {
    // Redirección si no hay sesión
    if (sCorreo || sPassword) {
      navigate("/");
    }
  }, []);

  if (loading) {
    return <Loaging />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Alerta centrada */}
      {showAlert && (
        <div className="absolute top-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
          Por favor completa todos los campos.
        </div>
      )}

      {showAlertConfirmation && (
        <div className="absolute top-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
          Información enviada.
        </div>
      )}

      {showAlertWarn && (
        <div className="absolute top-6 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
          {showAlertWarnMessage}
        </div>
      )}

      {/* Contenedor principal */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up scale-95 hover:scale-100 transition-all duration-300">
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in-down">Iniciar sesión</h2>
          <p className="text-1xl text-gray-500 mb-6">Bienvenido de nuevo 👋</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className='absolute inset-y-0 right-3 flex items-center text-gray-500'>
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-orange-500"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

            </div>
            <p className="text-sm text-center text-gray-500 mt-6">
              ¿Olvidaste tu contraseña?{' '}
              <a onClick={signInAction} ><span className="text-orange-500 underline cursor-pointer hover:text-orange-600 transition">
                Recuperar acceso
              </span></a>
            </p>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300"
            >
              Iniciar sesión
            </button>
            {/* <p className="text-sm text-center text-gray-500 mt-6">
              ¿No tienes cuenta? {' '}
              <a href="/registerUser">
                <span className="text-orange-500 underline cursor-pointer hover:text-orange-600 transition">
                  Regístrate
                </span>
              </a>
            </p> */}
          </form>


        </div>

        {/* Panel derecho (visual) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-orange-400 text-white p-10 flex-col text-center">
          <img src={Logo} alt="Planners Day" width={300} />
          <h2 className="text-2xl font-bold mb-4">¡Hola otra vez!</h2>
          <p className="text-sm">Ingresa tus credenciales para continuar</p>
        </div>
      </div>
    </div>
  );
}

export default Login;