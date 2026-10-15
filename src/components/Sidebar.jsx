// rrd imports
import { NavLink, useNavigate, Form } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useState } from 'react';
// Library
import { toast } from "react-toastify";
import { ChevronRightIcon, UserCircleIcon, ChevronLeftIcon, 
    BuildingStorefrontIcon, BellIcon, HomeIcon, 
    MagnifyingGlassIcon, ArrowRightStartOnRectangleIcon
 } from '@heroicons/react/24/solid';
// assents
import MenuWhite from "../assets/menu.png";
import User from "../assets/e.png";
import logo from "../assets/icon.png";
import './Sidebar.css';


export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const bPhotoUser = fetchData("photoUser") ?? [];
    const dorsl = fetchData("dorsl") ?? '';

    const [linksArray, setLinksArray] = useState([
        {
            label: 'Home',
            sublabel: '',
            icon: <HomeIcon className='w-8 h-8 mx-1 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "/findBusiness"
        },
        {
            label:
                (sUserCitaFix['first_name'] == "" || sUserCitaFix.length == 0
                    ? 'Agrega tu nombre'
                    : sUserCitaFix['first_name']),
            sublabel: 'Ver tus citas',
            icon: (bPhotoUser['data'] == null || bPhotoUser.length == 0
                ? <UserCircleIcon className='w-8 h-8 mx-1 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                : <img src={User} width={50} height={50} />),
            to: "home"
        },
        {
            label: (dorsl == '' || sUserCitaFix.length == 0
                ? 'Agrega tu empresa'
                : dorsl),
            sublabel: (dorsl == '' ? '' : 'Ver tu empresa'),
            icon: <BuildingStorefrontIcon className='w-8 h-8 mx-1 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: (dorsl == '' || sUserCitaFix.length == 0
                ? "registerBusiness"
                : "homeBusiness") 
        },
        {
            label: "Notificaiones",
            sublabel: "Ver tus notificaciones",
            icon: <BellIcon className='w-8 h-8 mx-1 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "notification"
        }

    ]);

    const ModSidebaropen = () => {
        setSidebarOpen(!sidebarOpen);
    };
    /* const onLogout=()=>{
        // delete tha user
        localStorage.removeItem("correo");
        localStorage.removeItem("pwd");
    } */
    return (
        <div className='SidebarContainer'>
            {sidebarOpen ? <button id="sidebar" onClick={ModSidebaropen}>
                <ChevronLeftIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10' />
            </button> : <button id="sidebar" onClick={ModSidebaropen}>
                <ChevronRightIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10' />
            </button>}
            <div className='Logocontent'>
                <div className="imgcontent">
                    {
                        sidebarOpen ?
                            <a className='OpenMenu' href="https://app.plannersday.com/"><img  id='logo' src={MenuWhite} /></a>
                            : <img id='logo' src={logo} />
                    }
                </div>
            </div>
            <div className='Divider' ></div>
            {/* <div className='LinkContainer'>
            <NavLink to='findBusiness'
                        className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                        <MagnifyingGlassIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />
                        <div >
                            {sidebarOpen && <span>Buscar</span>}
                            {sidebarOpen && <div className='LinkSubLabel'><span></span></div>}
                        </div>
                    </NavLink>
            </div>            
            <div className='Divider' ></div> */}
            {linksArray.map(({ icon, label, to, sublabel }) => (
                <div className="LinkContainer" key={label}>
                    <NavLink to={to}
                        className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                        {icon}
                        <div >
                            {sidebarOpen && <span>{label}</span>}
                            {sidebarOpen && <div className='LinkSubLabel '><span>{sublabel}</span></div>}
                        </div>
                    </NavLink>

                </div>
            ))}
            <div className='Divider' ></div>
            <div className="LogoutContainer">
                <ArrowRightStartOnRectangleIcon className='w-8 h-8 mx-1 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2'/>
                {sidebarOpen && <Form method="post" action="/logout" >
                        <button type="submit" id="LogoutButton" >
                            Cerrar sesión
                        </button>
                        
                    </Form>}
            </div>
            <div className='Divider' ></div>

        </div>

    );
}

export default Sidebar;
