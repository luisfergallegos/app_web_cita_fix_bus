// rrd imports
import { useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink, useLocation } from 'react-router-dom';

// Library
import { Bars3Icon, XMarkIcon, BuildingOffice2Icon, HomeIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";


export function NavbarBus() {
    // const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const location = useLocation();

    // const arrayBufferToBase64 = (buffer) => {
    //     var binary = '';
    //     var bytes = [].slice.call(new Uint8Array(buffer));
    //     bytes.forEach((b) => binary += String.fromCharCode(b));
    //     return btoa(binary);
    // };

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* logo */}
                <img
                    src={logo}
                    className="h-9 w-auto"
                    alt="PlannersDay"
                />

                {/* {location.pathname !== "/findUser" && (
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">

                        <NavLink
                            to="/findUser"
                            className="w-full flex items-center pl-3 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-left hover:bg-slate-100"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />

                            <span className="text-gray-400">
                                Explorar clientes
                            </span>
                        </NavLink>

                    </div>
                )} */}

                {/* Menú desktop */}
                <div className="hidden lg:flex items-center gap-6">
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `relative  ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-700'
                            }`}
                    >
                        <HomeIcon className="w-6 h-6" />
                    </NavLink>

                    <NavLink
                        to="/workspaces"
                        className={({ isActive }) =>
                            `relative  ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-700'
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <BuildingOffice2Icon className="w-6 h-6" />
                        </div>

                        {/* <span className="font-medium text-gray-800">
                            Explorar mis espacios
                        </span> */}
                    </NavLink>
                </div>
            </div>
            {/* Menú móvil */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">

                <div className="grid grid-cols-4 h-16">

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <HomeIcon className="w-6 h-6" />
                        <span className="text-xs">Inicio</span>
                    </NavLink>

                    {/* <NavLink
                        to="/findUser"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                        <span className="text-xs">Explorar</span>
                    </NavLink> */}

                    <NavLink
                        to="/workspaces"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <BuildingOffice2Icon className="w-6 h-6" />

                        <span className="text-xs">
                            Espacios
                        </span>
                        <span className="text-xs">
                            de trabajo
                        </span>
                    </NavLink>

                </div>

            </div>
        </nav>
    );
}

export default NavbarBus;
