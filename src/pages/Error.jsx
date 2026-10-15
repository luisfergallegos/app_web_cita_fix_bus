import { Link, useNavigate, useRouteError } from "react-router-dom";

// library
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Error = () => {

  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
      <div className="bg-white text-black rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4">Uh oh! We’ve got a problem.</h1>
        <p className="text-lg mb-4">La página que estás buscando no existe.</p>
        <p className="text-lg mb-4">{error.message || error.statusText}</p>
        <div className="flex items-center justify-between">
          <button className="bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-md"
            onClick={() => navigate(-1)}>
            <div className="flex py-2">
              <ArrowUturnLeftIcon width={20} />
              <span className="px-4">Go Back</span>
            </div>
          </button>
          <Link to="/" className="bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-md">
            <div className="flex py-2">
              <HomeIcon width={20} />
              <span className="px-4">Go Home</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Error