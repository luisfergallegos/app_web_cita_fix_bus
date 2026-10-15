// Library
import {
    MapPinIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ChevronRightIcon,
    PlusCircleIcon
} from "@heroicons/react/24/solid";
// assets
import Store from "../assets/business.png";
// rrd imports
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { urlApi } from "../styles/Constants.jsx";

const StarRating = (stars) => "⭐".repeat(stars);
const StarRatingNot = (stars) => "✰".repeat(stars);

export function CardBusiness({
    key,
    userId,
    userName,
    empresa,
    setIsOpen,
    setIndexEmp,
    setQualifications,
    setSelectBusiness,
    selectBusiness
}) {
    const navigate = useNavigate();

    const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        let bytes = [...new Uint8Array(buffer)];
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return btoa(binary);
    };

    const {
        BUSSINESS_ID,
        USER_ID,
        DORSL,
        PHOTO,
        SUBCATEGORY,
        SERVICE_LEVEL,
        ADDRESS_FIRST,
        ADDRESS_SECOND,
        POSTAL_CODE,
        CITY,
        STATE,
        phone,
        Horario,
    } = empresa;

    const desplegarPantallaAddAppoin = async (e) => {
        e.stopPropagation();
        if (!userName) {
            navigate("/addAppoinBusinessAnon", { state: { businessId: BUSSINESS_ID, dorsl: DORSL, selectSpace: [] } });
        }
        else {
            navigate("/addAppoin", {
                state: { userId: userId, userName: userName, business: empresa },
            });
        }

    };

    const handleButtonIcon = async (e) => {
        e.stopPropagation();
        setIsOpen(true);
        setIndexEmp(empresa);

        try {
            const response = await fetch(
                `${urlApi}getBusCalif?bussiness_id=${empresa["BUSSINESS_ID"]}`
            );
            const json = await response.json();

            if (json.sucess) setQualifications(json.data);
            else setQualifications([]);

            if (!response.ok) throw new Error("Error al obtener calificaciones");
        } catch (e) {
            return;
        }
    };

    const handleADDRESS = (e) => {
        e.stopPropagation();
        const url = `${ADDRESS_FIRST} ${ADDRESS_SECOND} CP ${POSTAL_CODE} ${CITY}, ${STATE} Mexico`;

        if (/iPhone|iPad|iPod/.test(navigator.platform)) {
            window.open(`maps://maps.google.com/?q=${url}`);
        } else {
            window.open(`https://maps.google.com?q=${url}`);
        }
    };

    const handleViewProfile = async () => {
        const baseUrl = '/viewBusiness';
        const params = new URLSearchParams({
            n: DORSL,
            i: BUSSINESS_ID
        });
        navigate(`${baseUrl}?${params.toString()}`);

    };

    return (
        <div
            className={`bg-white shadow-xl rounded-3xl p-6 w-full max-w-lg mx-auto cursor-pointer border border-white 
                hover:scale-105 hover:shadow-2xl transition-all 
                ${selectBusiness == BUSSINESS_ID ? "ring-2 ring-blue-500" : ""} `}
            onClick={() => {
                setSelectBusiness(selectBusiness == BUSSINESS_ID ? null : BUSSINESS_ID);
            }}
        >
            {/* BOTÓN AddAppoin */}
            {selectBusiness == BUSSINESS_ID ? <button
                onClick={desplegarPantallaAddAppoin}
                className="w-full flex items-center justify-end"
            >
                <PlusCircleIcon className="w-10 h-10 text-orange-500 flex-shrink-0" />
            </button> : <></>}
            {/* ICONO GRANDE */}
            <div
                className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden">
                {PHOTO == null ? (
                    <img
                        src={Store}
                        className="w-full h-full object-contain opacity-70 bg-gray-400"
                        alt="store"
                    />
                ) : (
                    <img
                        src={`data:image/jpeg;base64,${arrayBufferToBase64(PHOTO.data)}`}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* TITULO */}
            <h4 className="text-2xl font-bold text-center text-gray-900 mt-6">
                {DORSL}
            </h4>
            <p className="text-center text-gray-500 text-lg mb-2">{SUBCATEGORY}</p>

            {/* CALIFICACIÓN */}
            <p className={`text-center text-xl mb-4 ${SERVICE_LEVEL == 0 ? 'text-gray-500' : 'text-yellow-500'}`}>
                {SERVICE_LEVEL == 0 ? StarRatingNot(5) : StarRating(SERVICE_LEVEL)}
            </p>
            {/* BOTÓN VER PERFIL */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // evita que active el onClick del card
                    handleViewProfile();
                }}
                className="mt-2 mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition-all"
            >
                Ver perfil
            </button>



            <hr className="my-4 border-gray-200" />

            {/* DIRECCIÓN */}
            <div className="flex gap-4 mb-3 items-start">
                <MapPinIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
                <p
                    className="text-gray-700 text-sm leading-tight cursor-pointer"
                    onClick={handleADDRESS}
                >
                    {ADDRESS_FIRST}, {ADDRESS_SECOND}, {POSTAL_CODE} {CITY}, {STATE},
                    México
                </p>
            </div>

            {/* TELÉFONO */}
            <div className="flex gap-4 mb-3 items-center">
                <PhoneIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                    {phone !== "" ? phone : "Este negocio aún no ha agregado información de contacto."}
                </p>
            </div>

            {/* HORARIO */}
            <div className="flex gap-4 items-center">
                <CalendarDaysIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{Horario}</p>
            </div>

            {/* BOTÓN CALIFICACIONES */}
            <button
                onClick={handleButtonIcon}
                className="w-full flex items-center justify-end text-gray-600 text-base py-3 mt-2"
            >
                <ChevronRightIcon className="w-5 h-5 text-gray-800 mt-1 ml-4" />
                <span className="mr-2">Reseñas</span>
            </button>
        </div>
    );
}

export default CardBusiness;