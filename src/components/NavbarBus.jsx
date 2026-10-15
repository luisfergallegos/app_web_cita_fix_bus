// rrd imports
import { useEffect, useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink, useLocation } from 'react-router-dom';

// Library
import { Bars3Icon, XMarkIcon, BuildingOffice2Icon, HomeIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";
import PerfilPopover from './PerfilPopover.jsx';


export function NavbarBus() {
    const [showPerfilPopover, setShowPerfilPopover] = useState(false);

    useEffect(() => {
        setShowPerfilPopover(false);
    }, [location.pathname]);

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* logo */}
                <img
                    src={logo}
                    className="h-9 w-auto"
                    alt="PlannersDay"
                />

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

                    <div className="relative">
                        <button
                            onClick={() => setShowPerfilPopover(!showPerfilPopover)}
                            className={`flex items-center gap-3 hover:text-green-500 transition ${showPerfilPopover
                                ? "text-green-500" : "text-gray-700"}`
                            }
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <UserIcon className="w-6 h-6" />
                            </div>

                            <span className="font-medium text-gray-800">
                                Perfil
                            </span>
                        </button>

                        {showPerfilPopover && (
                            <PerfilPopover />
                        )}
                    </div>
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

                    <NavLink
                        to="/viewUpdateUser"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-green-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <UserIcon className="w-6 h-6" />

                        <span className="text-xs">
                            Perfil
                        </span>
                    </NavLink>

                </div>

            </div>
        </nav>
    );
}

export default NavbarBus;
