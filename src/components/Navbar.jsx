// rrd imports
import { useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink } from 'react-router-dom';

// Library
import { Bars3Icon, XMarkIcon, HomeIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";


export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);    
    const numNoti = fetchData("numNot") ?? 0;
    const [numNotificaciones, setNumNotificaciones] = useState(numNoti);
    const [linksArray, setLinksArray] = useState([
        {
            label: 'Inicio',
            icon: <HomeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "home"
        },
        {
            label: 'Buscar',
            icon: <MagnifyingGlassIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "/findBusiness"
        },
        {
            label: "Notificaciones",
            icon: (
                <div className="relative">
                    <BellIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                    {numNotificaciones > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {numNotificaciones > 9 ? "9+" : numNotificaciones}
                        </span>
                    )}
                </div>
            ),
            to: "notification"
        },
    ]);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* logo */}
                <a href="https://app.plannersday.com/home"><img src={logo} className='h-10 w-auto' /></a>
                {/* Botón para móvil */}
                <button className="lg:hidden" onClick={toggleMenu}>
                    {isOpen ? <XMarkIcon width={24} /> : <Bars3Icon width={24} />}
                </button>
                {/* Menú desktop */}
                <ul className="hidden lg:flex space-x-6 text-orange-600 font-medium">
                    {linksArray.map(({ icon, label, to }) => (
                        <NavLink to={to}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </ul>
            </div>
            {/* Menú móvil */}
            {isOpen && (
                <ul className="lg:hidden bg-white px-4 pt-2 pb-4 space-y-2 text-orange-600 font-medium shadow-md">
                    {linksArray.map(({ icon, label, to }) => (
                        <NavLink to={to} onClick={toggleMenu}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </ul>
            )}
        </nav>
    );
}

export default Navbar;
