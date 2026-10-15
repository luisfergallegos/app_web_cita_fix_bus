// rrd imports
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

import SingIn from './authenticate/SignIn.jsx';
// assents
import Logo from "../assets/menu.png";
import { urlApi } from "../styles/Constants.jsx";

// Routes
// import Home from "../pages/Home.jsx";
// import FindBusiness from "../pages/business/Find_business.jsx";
// import HomeBusiness from "../pages/business/Home_business.jsx";
import Workspaces from '../pages/business/Workspaces.jsx';

// helper funtions
import { fetchData } from "../Wrapper.js";

// loader
export function loginFormLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const slastSession = fetchData("lastsession");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const userId = sUserCitaFix['USER_ID'] ?? "";
    
    return { sCorreo, sPassword, slastSession, userId};
}

export function LoginForm() {
    const { sCorreo, sPassword, slastSession, userId } = useLoaderData();

    useEffect(() => {
        const fData = async () => {         
            var Aux = new Date();
            var dateFormat = Aux.getMonth() + 1;
            var _today = `${Aux.getFullYear()}-${('0' + dateFormat).slice(-2)}-${Aux.getDate()}`;
            if (_today != slastSession) {
                if (sCorreo) {
                    //Solicitar por GET
                    var options = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                    try {
                        const response = await fetch(`${urlApi}userLastSession?email=${sCorreo}`, options);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const json = await response.json();
                        var Aux = new Date();
                        var dateFormat = Aux.getMonth() + 1;
                        var _today = `${Aux.getFullYear()}-${('0' + dateFormat).slice(-2)}-${Aux.getDate()}`;
                        localStorage.setItem("lastsession", JSON.stringify(_today));

                    }
                    catch (e) {
                        return;
                    }
                }
            }
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            try {
                const response = await fetch(`${urlApi}notification?userid=${userId}`, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                let Aux = json['data'];
                //Solicitar por GET
                var options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
                try {
                    const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`, options);
                    if (response.status == 200) {
                        const json = await response.json();
                        localStorage.setItem("numNot", json['data'].filter(e => e.CONFIRM == 0).length + Aux.length);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                catch (e) {
                    return;
                }
            }
            catch (e) {
                return;
            }
            
        };
        fData();
    }, []);

    return (
        <>
            {sCorreo && sPassword ? <Workspaces /> :
                <div id="containerLogin">
                    <div className="containerLogin">
                        <SingIn />
                    </div>
                </div>
            }
        </>
    );
}

export default LoginForm;