// rrd imports
import { Form, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { urlApi } from "../styles/Constants.jsx";
import { fetchData } from "../Wrapper.js";
// assets

import { ChevronDownIcon, UserIcon, EyeSlashIcon, EyeIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import Loaging from '../components/Loading.jsx';

export default function PerfilPopover() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const userId = sUserCitaFix['USER_ID'] ?? "";
    const [viewAll, setViewAll] = useState(true);

    const [passType, setPassType] = useState('password');
    const [contraseña, setContraseña] = useState();
    const [passView, setPassView] = useState(true);

    const togglePassView = () => {
        setPassView(!passView);
        setPassType(passView ? 'text' : 'password');
    };

    const handleChangeContraseña = evt => {
        const value = evt.target.value;
        setContraseña(value);
    };

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            setContraseña(sUserCitaFix['password']);
            setLoading(false);
        };
        fData();
    }, []);

    return (
        <div className="absolute right-0 mt-4 w-96 rounded-2xl bg-white border shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <UserIcon className="w-6 h-6" />
                </div>
                <h3 className="ml-4 font-bold text-lg">
                    {sUserCitaFix?.first_name + " " + sUserCitaFix?.last_name || 'Inicio'}
                </h3>
            </div>
            <div className="border-t">
                <div className="flex items-center justify-center w-full py-3 hover:bg-gray-100 text-green-500 font-semibold">
                    <ArrowRightStartOnRectangleIcon className='w-5 h-5 text-green-600' />
                    <Form method="post" action="/logout">
                        <button type="submit" className="ml-4 text-green-500 rounded-md">
                            Cerrar sesión
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );

}