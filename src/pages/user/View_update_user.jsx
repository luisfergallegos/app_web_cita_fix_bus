
// rrd imports
import { Form, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";

import Loaging from '../../components/Loading.jsx';
import { UserIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon, ChevronUpIcon  } from '@heroicons/react/24/solid';

export function ViewUpdateUser() {
    const navigate = useNavigate();
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const [loading, setLoading] = useState(true);
    const [logoutGroup, setLogoutGroup] = useState(true);



    const toggle = (setter) => setter((prev) => !prev);


    useEffect(() => {
        if (sCorreo == null && sPassword == null) {
            navigate("/");
        }
        else
            setLoading(false);
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800 px-4">
            <div className="max-w-3xl mx-auto p-6 space-y-6 text-gray-800">
                {/* Imagen usuario */}
                <div className="flex justify-center mb-6 mt-10">
                    <div className='relative inline-block'>
                        <div className='rounded-full object-cover border bg-white'>
                            <UserIcon className="w-32 h-32" />
                        </div>
                    </div>
                </div>
                {/* Grupo Cerrar sesión */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setLogoutGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <ArrowRightStartOnRectangleIcon className='w-5 h-5 text-green-600' />
                            <span className="font-semibold">Cerrar sesión</span>
                        </div>
                        {logoutGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!logoutGroup && (
                        <div className="mt-4">
                            <Form method="post" action="/logout" >
                                <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                    Confirmar
                                </button>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewUpdateUser;