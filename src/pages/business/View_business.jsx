// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, ClockIcon, StarIcon, LinkIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
// assents
import Store from "../../assets/business.png";
import Logo from "../../assets/splash.png";
import Loaging from '../../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { urlApi } from "../../styles/Constants.jsx";
import { useEffect, useState, useRef } from "react";
import { fetchData } from '../../Wrapper.js';
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const StarRating = (stars) => '⭐'.repeat(stars);
const StarRatingNot = (stars) => "✰".repeat(stars);

// loader
export async function ViewBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function ViewBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);
    const [horario, setHorario] = useState([]);

    const [searchParams] = useSearchParams();
    const businessId = searchParams.get("i");
    const businessDORSL = searchParams.get("n");

    const [sURL, setURL] = useState();
    const [empresa, SetEmpresa] = useState([]);
    const previewRef = useRef();

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    // Formatea la fecha en español (27 de noviembre de 2025)
    function formatDate(iso) {
        if (!iso) return "";
        try {
            var parts = iso.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "short",
            })
                .replace(".", "") // Quita puntos como "mié."
                .replace(/\b\w/g, c => c.toLowerCase()); // Asegura minúsculas
        } catch {
            return iso;
        }
    }

    // Descargar como imagen (opcional). Requiere html2canvas instalado
    async function downloadAsImage() {
        try {
            const node = previewRef.current;
            if (!node) return;

            const canvas = await html2canvas(node, { scale: 2 });
            const dataUrl = canvas.toDataURL("image/png");

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], "invitacion.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    text: "Próximas citas disponibles",
                    url: sURL,
                });
                return;
            }

            const link = document.createElement("a");
            link.download = `${empresa.DORSL}_citas_disponibles.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.info("Descargamos la imagen porque tu navegador no soporta compartir archivos.");

        } catch (e) {
            console.error(e);
            toast.error("Ocurrió un error generando la imagen.");
        }

    }

    const desplegarPantallaAddAppoin = async (e) => {
        e.stopPropagation();
        if (!userName) {
            navigate("/addAppoinBusinessAnon", { state: { empresa: empresa, selectSpace: [] } });
        }
        else {
            navigate("/addAppoin", {
                state: { userId: userId, userName: userName, business: empresa },
            });
        }
    };

    useEffect(() => {
        // Cargar user info desde loader
        if (!businessId && !businessDORSL) {
            navigate("/home");
        }
        var auxUser = fetchData("UserCitaFix") ?? "";
        if (auxUser) {
            setUserId(auxUser['USER_ID'] ?? "");
            var auxName = `${auxUser['first_name'] ?? ""} ${auxUser['last_name'] ?? ""}`;
            setUserName(auxName);
        }
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    SetEmpresa(json['data']);
                    const baseUrl = 'https://www.plannersday.com/viewBusiness';
                    const params = new URLSearchParams({
                        n: businessDORSL,
                        i: businessId
                    });
                    setURL(`${baseUrl}?${params.toString()}`);
                    try {
                        const response = await fetch(`${urlApi}getBusCalif?bussiness_id=${businessId}`);
                        const json = await response.json();
                        if (json['sucess']) {
                            setQualifications(json['data']);
                        }
                        else {
                            setQualifications([]);
                        }
                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${businessId}`);
                            if (response.status == 200) {
                                const json = await response.json();
                                setHorario(json['data']);
                            } else {
                                console.log(`Error getting schedule.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            setLoading(false);
                        }
                        catch (e) {
                            setLoading(false);
                            return;
                        }
                    }
                    catch (e) {
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log(`Error getting bussinessId.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            catch (e) {
                setLoading(false);
                return;
            }
        };
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(empresa.PHOTO == null ? empresa.PHOTO : empresa.PHOTO.data);

    return (
        <div>

            {
                sCorreo == null & sPassword == null ?
                    /* Navbar */
                    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                            <div className="text-2xl font-bold tracking-tight">
                                <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                            </div>
                            <nav className="hidden gap-8 md:flex">
                            </nav>
                            <button className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
                                onClick={() => navigate("/login")}>
                                Iniciar sesión
                            </button>
                        </div>
                    </header> : <div></div>
            }

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-4">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">
                    {/* BOTÓN copy enlace */}
                    <button onClick={() => {
                        navigator.clipboard.writeText(sURL);
                        window.open(
                            `https://wa.me/?text=${encodeURIComponent('Próximas citas disponibles: ' + sURL)}`,
                            "_blank"
                        );
                        return toast.info(`El enlace se ha copiado en el portapapeles`);
                    }}
                        className="w-full flex items-center justify-end"
                    >
                        <LinkIcon className="w-10 h-10 text-orange-500 flex-shrink-0" />
                    </button>
                    <div className="flex flex-col items-center">
                        {photoBase64 ? (
                            <img className="w-64 h-64 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                        ) : (
                            <img className="w-64 h-64 rounded-full object-cover border mt-4 bg-gray-200" src={Store} alt="default" />
                        )}
                        <h3 className="text-2xl font-bold mt-4 text-black">{empresa.DORSL}</h3>
                        <p className="text-gray-500 mb-3">{empresa.SUBCATEGORY}</p>
                        <p className={`text-center text-xl mb-4 ${empresa.SERVICE_LEVEL == 0 ? 'text-gray-500' : 'text-yellow-500'}`}>
                            {empresa.SERVICE_LEVEL == 0 ? StarRatingNot(5) : StarRating(empresa.SERVICE_LEVEL)}
                        </p>
                    </div>
                    <hr className="my-4" />
                    <div className="w-full flex items-center gap-3 px-4 mt-2" style={{
                        cursor: 'pointer'
                    }}
                        onClick={() => {
                            if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                window.open(`maps://maps.google.com/?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
                            } else {
                                window.open(`https://maps.google.com?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
                            }
                        }}>
                        <MapPinIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{empresa.ADDRESS_FIRST} {empresa.ADDRESS_SECOND} CP {empresa.POSTAL_CODE}</p>
                            <p className="text-gray-500">{empresa.CITY}, {empresa.STATE}</p>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-3 px-4 mt-2 mb-2">
                        <PhoneIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{empresa.phone || 'Este negocio aún no ha agregado información de contacto.'}</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    

                    {/* Tarjeta de citas disponibles */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        {/* Contenido que se exporta como imagen */}
                        <div
                            ref={previewRef}
                            className="bg-gradient-to-br from-gray-100 to-indigo-50 p-5"
                        >
                            {/* Información del negocio */}
                            <div className="flex items-center gap-3 mb-5">
                                <img
                                    src={photoBase64
                                        ? `data:image/jpeg;base64,${photoBase64}`
                                        : Store}
                                    alt={empresa.DORSL}
                                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                                />

                                <div className="min-w-0 text-left">
                                    <h3 className="font-bold text-gray-900 truncate">
                                        {empresa.DORSL}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {empresa.CATEGORY}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-gray-800">
                                    Próximas citas disponibles
                                </h4>
                                <ClockIcon className="w-5 h-5 text-orange-500" />
                            </div>

                            <div className="space-y-2">
                                {horario.slice(0, 5).map((h, index) => {
                                    const disponibles = h.APPOINTMENT.filter(
                                        a => a.STATUS === "free"
                                    ).length;

                                    return (
                                        <div
                                            key={`${h.APPOINTMENT_DATE}-${index}`}
                                            className="flex items-center justify-between gap-2 bg-white/80 rounded-xl px-3 py-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-5 h-5 text-orange-500" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formatDate(h.APPOINTMENT_DATE)}
                                                </span>
                                            </div>

                                            <span className="shrink-0 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold">
                                                {disponibles} libres
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Acciones fuera de la imagen exportada */}
                        <div className="p-4 bg-white">
                            {sCorreo == null && sPassword == null ? (
                                <button
                                    type="button"
                                    onClick={desplegarPantallaAddAppoin}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-3.5 px-5 shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                                >
                                    <span>Agendar una cita</span>
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={downloadAsImage}
                                    className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-5 transition-colors"
                                >
                                    Compartir imagen
                                </button>
                            )}

                            <p className="text-center text-xs text-gray-500 mt-3">
                                {sCorreo == null && sPassword == null
                                    ? "Selecciona el día y horario que mejor te convenga"
                                    : "Comparte tus horarios disponibles en redes sociales"}
                            </p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="text-left px-4">
                        <h4 className="text-lg font-semibold">Reseñas de clientes</h4>
                        <div>
                            {qualifications.length > 0 ? (
                                qualifications.map((q) => (
                                    <div key={q.SERVICE_LEVEL_DATE} className="text-sm text-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{q.USER}</span>
                                            <span>{StarRating(q.SERVICE_LEVEL)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-400">{q.SERVICE_LEVEL_DATE}</p>
                                            <p className="text-sm mt-1">{q.COMMENTS}</p>
                                        </div>
                                        <hr className="my-2" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">Este negocio aún no tiene reseñas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewBusiness;