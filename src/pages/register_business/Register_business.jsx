// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import Select from "react-select";
// assets
import './Register_business.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";

// loader
export function registerBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const dorsl = sUserCitaFix['DORSL'];
    return { sCorreo, sPassword, dorsl };
}


export function RegisterBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, dorsl } = useLoaderData();
    const [loading, setLoading] = useState(true);

    const [sName, setName] = useState('');
    const [sNameError, setsNameError] = useState();
    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setsubCategorias] = useState([]);
    const [categoriaId, setSubCategoriaId] = useState('');
    const [sCategoriaName, setCategoriaName] = useState('');
    const [sCategoriaNameError, setCategoriaNameError] = useState();
    const [sSubCategoriaName, setSubCategoriaName] = useState('');
    const [sSubCategoriaNameError, setSubCategoriaNameError] = useState();
    const [codigoPostal, setCodigoPostal] = useState('');
    const [estado, setEstado] = useState();
    const [ciudad, setCiudad] = useState();
    const [colonias, setColonias] = useState([]);
    const [direccionUno, setDireccionUno] = useState('');
    const [direccionUnoError, setdireccionUnoError] = useState();
    const [direccionDos, setDireccionDos] = useState('');
    const [direccionDosError, setdireccionDosError] = useState();
    const [countCodigoPostal, setCountCodigoPostal] = useState(0);

    const register = async (e) => {
        //ValidateName
        if (sName == "") {
            setsNameError("Ingresa el nombre de tu empresa");
            return;
        }
        else {
            setsNameError("");
        }

        //ValidateCategoria
        if (sSubCategoriaName.label == "") {
            setSubCategoriaNameError("Ingresa tu categoría comercial");
            return;
        } else {
            setSubCategoriaNameError("");
        }

        //ValidateSubCategoria
        /* if (sSubCategoriaName == "") {
            setSubCategoriaNameError("Ingresa tu categoría comercial");
            return;
        }
        else {
            setSubCategoriaNameError("");
            for (var filName in subCategorias) {
                if (subCategorias[filName].subname.toLowerCase() == sSubCategoriaName.toLowerCase()) {
                    setSubCategoriaName(subCategorias[filName].subname);
                    setSubCategoriaId(subCategorias[filName].id);
                }
            }
        } */

        //ValidateCalle/Numero
        if (direccionUno == "") {
            setdireccionUnoError("Ingresa tu calle / número");
            return;
        }
        else {
            setdireccionUnoError("");
        }

        //ValidateColina
        if (direccionDos == "") {
            setdireccionDosError("Ingresa tu colonia");
            return;
        }
        else {
            setdireccionDosError("");
        }
        const auxUserCitaFix = fetchData("UserCitaFix");

        //Enviar por POST
        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'user_id': auxUserCitaFix.USER_ID,
                    'name': sName,
                    'latitude': '0',
                    'longitude': '0',
                    'bussiness_branch_id': sSubCategoriaName.value,
                    'address_first': direccionUno,
                    'address_second': direccionDos,
                    'postal_code': codigoPostal,
                    'city': ciudad,
                    'state': estado
                })
        }
        try {
            const response = await fetch(`${urlApi}bussiness`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                console.log(`Error al guardar bussiness.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                getUser();
            }

        }
        catch (e) {
            return;
        }

    };

    const getCodigoPostal = async (evt) => {
        const value = evt.target.value;
        var tempcita = [];
        setCountCodigoPostal(evt.target.value.length);
        if (evt.target.value.length == 5) {
            setCodigoPostal(value);
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                // console.log(json['data']);
                setEstado(json['data'][0].d_estado);
                setCiudad(json['data'][0].d_ciudad);
                var tempcita = [];
                for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                    var element = json['data'][0].d_asentas[index];
                    tempcita.push(element.d_asenta);
                }
                setColonias(tempcita);
            }
            catch (e) {
                return;
            }
            /* const json = fetchData("postalCode") ?? [];
            setEstado(json['data'][0].d_estado);
            setCiudad(json['data'][0].d_ciudad);
            var tempcita = [];
            for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                var element = json['data'][0].d_asentas[index];
                tempcita.push(element.d_asenta);
            }
            setColonias(tempcita); */
        }
        else {
            setColonias(tempcita);
            setEstado('');
            setCiudad('');
        }
    };

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };

    /* const handleChangeCategoria = evt => {
        const value = evt.target.value;
        setCategoriaName(value);
        for (var filName in categorias) {
                if (categorias[filName].name.toLowerCase() == value.toLowerCase()) {
                    setsubCategorias(categorias[filName].subcategoria);
                }
            }

    }; */

    /* const handleChangeSubCategoria = evt => {
        const value = evt.target.value;
        setSubCategoriaName(value);
    }; */

    const handleChangeColonia = evt => {
        const value = evt.target.value;
        setDireccionDos(value);
    };

    const getUser = async () => {
        const auxCorreo = fetchData("correo");
        const auxPassword = fetchData("pwd");
        //Solicitar por GET
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-citafix-ps': auxPassword
            }
        }
        try {
            const response = await fetch(`${urlApi}usr?email=${auxCorreo}`, options);
            if (!response.ok) {
                console.log(`No se pudo obtener informacion del usuario`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            localStorage.setItem("UserCitaFix", JSON.stringify(json['data']));
            navigate('/', { replace: true }); // <-- redirect
        }
        catch (e) {
            return;
        }
    };

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}categoria`);
                if (!response.ok) {
                    console.log(`Error getting categoria.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                // var tempCategoria = [];
                var tempSubCategoria = [];
                for (const key in json['data']) {
                    if (json['data'].hasOwnProperty(key)) {
                        const element = json['data'][key];
                        const values = Object.values(element.subcategoria);
                        // var tempSub = [];
                        values.map((subCat) => {
                            /* tempSub.push({
                                id: subCat.id,
                                subname: subCat.subname ?? ''
                            }); */
                            tempSubCategoria.push({
                                                value: subCat.id,
                                                label: subCat.subname ?? ''
                                            });
                        });
                        /* tempCategoria.push({
                            name: element.name,
                            subcategoria: tempSub
                        }); */
                    }
                }
                // setCategorias(tempCategoria);
                setsubCategorias(tempSubCategoria);
                setLoading(false);
            }
            catch (e) {
                setLoading(false);
                return;
            }
        };
        if (dorsl != '') {
            navigate("/");
        }
        else if (sCorreo == null && sPassword == null) {
            navigate("/");
        }
        fData();
    }, []);
    if (loading) {
        return <Loaging />;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            <div className="container mt-20 rounded-3xl shadow-xl  w-full text-center animate-fade-in-up">
                <div className="title">
                    Agrega tu empresa <span>Es rápido y fácil</span>
                </div>
                <div className="registerForm">
                    <div className="registerForm-group text-black">
                        <label>¿Cómo se llama tu empresa ?</label>
                        <input type="text" name="sName" placeholder="Nombre de la empresa" required onChange={(e) => setName(e.target.value)} />
                        {sNameError ? <label className='errorlabel' name="userNameError">{sNameError}</label> : <></>}
                    </div>
                    <div className="registerForm-group text-black">
                        <label>¿Que tipo de negocio tienes?</label>
                        <Select
                                    value={sSubCategoriaName}
                                    onChange={setSubCategoriaName}
                                    options={subCategorias}
                                    placeholder='Selecciona una opción'
                                    isSearchable={false}
                                />
                        {/*  <input type="text" name="sCategoriaName" placeholder="Categoría comercial" required onChange={(e) => setCategoriaName(e.target.value)} /> */}
                        {/* <input list="optionsListCat" type="text" placeholder='Giro de empresa' onChange={handleChangeCategoria} required ></input>
                        <datalist id="optionsListCat">
                            {categorias.map((option, index) => (
                                <option key={index} value={option.name} />
                            ))}
                        </datalist> */}
                        {sSubCategoriaNameError ? <label className='errorlabel' name="sSubCategoriaNameError"> {sSubCategoriaNameError}</label> : <></>}
                        {/* {sCategoriaNameError ? <label className='errorlabel' name="sCategoriaNameError"> {sCategoriaNameError}</label> : <></>} */}
                    </div>
                    {/* <div className="registerForm-group text-black">
                        <label>Elige la categoría que describa mejor tu empresa</label>
                        <input list="optionsListSubCat" type="text" placeholder='Categoría comercial' onChange={handleChangeSubCategoria} required ></input>
                        <datalist id="optionsListSubCat">
                            {subCategorias.map((option, index) => (
                                <option key={index} value={option.subname} />
                            ))}
                        </datalist>
                        {sSubCategoriaNameError ? <label className='errorlabel' name="sSubCategoriaNameError"> {sSubCategoriaNameError}</label> : <></>}
                    </div> */}
                    <div className="registerForm-group text-black">
                        <label>Código postal</label>
                        <input type="text" placeholder='Código postal' maxLength={5} onChange={getCodigoPostal} />
                        <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label>
                    </div>
                    <div className="registerForm-group">
                        <label>Estado</label>
                        <input className='--placeholder' type="text" placeholder='Estado' value={estado} disabled />
                    </div>
                    <div className="registerForm-group">
                        <label>Municipio/Ciudad</label>
                        <input className='--placeholder' type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                    </div>
                    <div className="registerForm-group text-black">
                        <label>Colonia</label>
                        <input list="optionsList" type="text" placeholder='Colonia'
                            disabled={colonias.length == 0 ? true : false}
                            onChange={handleChangeColonia} required ></input>
                        <datalist id="optionsList">
                            {colonias.map((option, index) => (
                                <option key={index} value={option} />
                            ))}
                        </datalist>
                        {direccionDosError ? <label className='errorlabel' name="direccionDosError">{direccionDosError}</label> : <></>}
                    </div>
                    <div className="registerForm-group text-black">
                        <label>Calle / Número externo</label>
                        <input type="text" placeholder='Calle / Número externo'
                            onChange={handleChange} />
                        {direccionUnoError ? <label className='errorlabel' name="direccionUnoError">{direccionUnoError}</label> : <></>}
                    </div>
                    <div className="registerForm-button">
                        <button type="submit" onClick={register} > <span>Crear empresa</span></button>
                    </div>
                </div>
            </div>
        </div>);
}

export default RegisterBusiness;