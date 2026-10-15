// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Select from "react-select";
// assets
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import PersonIcon from "../../assets/business.png";

import {
    UserCircleIcon, MagnifyingGlassIcon, BuildingOfficeIcon, ChevronDownIcon,
    ChevronUpIcon, ClockIcon, MapPinIcon, Squares2X2Icon, CameraIcon, CheckCircleIcon,
    HomeIcon, UserPlusIcon, XMarkIcon,
    RectangleGroupIcon,
    TagIcon,
    PencilSquareIcon
} from '@heroicons/react/24/solid';
import RegisterSchedule from '../schedule/register_schedule.jsx';
import UpdateSchedule from '../schedule/update_schedule.jsx';

// loader
export function viewUpdateBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function ViewUpdateBusiness() {
    const location = useLocation();
    const navigate = useNavigate();
    const businessId = location.state?.businessId ?? '';
    const businessAdmin = location.state?.tipo;
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [bussiness, setBussiness] = useState([]);
    const [horario, setHorario] = useState([]);
    const [_excludeTimes, setExcludeTimes] = useState([]);
    const [nameGroup, setNameGroup] = useState(true);
    const [categoriaGroup, setCategoriaGroup] = useState(true);
    const [horarioGroup, setHorarioGroup] = useState(true);
    const [addressGroup, setAddressGroup] = useState(true);
    const [homeServiceGroup, sethomeServiceGroup] = useState(true);
    const [CollaboratorGroup, setCollaboratorGroup] = useState(true);
    const [codigoPostal, setCodigoPostal] = useState('');
    const [countCodigoPostal, setCountCodigoPostal] = useState(0);
    const [estado, setEstado] = useState();
    const [ciudad, setCiudad] = useState();
    const [colonias, setColonias] = useState([]);
    const [direccionDos, setDireccionDos] = useState('');
    const [direccionUno, setDireccionUno] = useState('');
    const [name, setName] = useState();
    const [subCategorias, setsubCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState('');
    const [sCategoriaName, setCategoriaName] = useState('');
    const [sSubCategoriaName, setSubCategoriaName] = useState(null);
    const [searchText, setsearchText] = useState('');
    const [filteredNames, setfilteredNames] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosbkq, setUsuariosbkq] = useState([]);
    const [selectUser, setSelectUser] = useState(null);
    const [colaboraciones, setColaboraciones] = useState([]);
    const [espacioGroup, setEspacioGroup] = useState(true);
    const [spaceName, setSpaceName] = useState('Consultorio');
    const [spaceNameAlias, setSpaceNameAlias] = useState('');
    const [spaceNameFree, setSpaceNameFree] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [selectSpace, setSelectSpace] = useState(null);

    const [showAlertConfirmation, setshowAlertConfirmation] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [imagenFile, setImagenFile] = useState(null);
    const [bimagen, setbImagen] = useState(true);
    const [bAcceder, setbAcceder] = useState(true);
    const [bAccederHS, setbAccederHS] = useState(true);
    const [bAccederName, setbAccederName] = useState(true);
    const [bAccederCategoria, setbAccederCategoria] = useState(true);
    const [bAccederCollaborator, setbAccederCollaborator] = useState(true);
    const [bAccederEspacio, setbAccederEspacio] = useState(true);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const toggle = (setter) => setter((prev) => !prev);

    const ModNameGroupOpen = async (e) => {
        e.stopPropagation();
        if (bussiness.DORSL != name) {
            if (bAccederName) {
                setbAccederName(false);
                //Enviar por PUT
                var options = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'user_id': bussiness.USER_ID,
                            "bussiness_id": bussiness.BUSSINESS_ID,
                            'name': name,
                            'latitude': bussiness.LATITUDE,
                            'longitude': bussiness.LONGITUDE,
                            'bussiness_branch_id': bussiness.BUSSINESS_BRANCH_ID,
                            'address_first': bussiness.ADDRESS_FIRST,
                            'address_second': bussiness.ADDRESS_SECOND,
                            'postal_code': bussiness.POSTAL_CODE,
                            'city': bussiness.CITY,
                            'state': bussiness.STATE,
                            "home_service": bussiness.HOME_SERVICE
                        })
                }
                try {
                    const response = await fetch(`${urlApi}bussiness`, options);
                    const json = await response.json();
                    if (json['sucess']) {
                        localStorage.setItem("dorsl", JSON.stringify(name));
                        setshowAlertConfirmation(true);
                        setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                        setTimeout(() => window.location.reload(), 3000);
                    }
                    else {
                        console.log(`No se pudo actulizar informacion de la empresa`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                }
                catch (e) {
                    setbAccederName(true);
                    return;
                }
                setbAccederName(true);
            }
        }
    };

    const ModHomeServiceGroupOpen = async (e) => {
        e.stopPropagation();
        if (bAccederHS) {
            setbAccederHS(false);
            const hs = bussiness.HOME_SERVICE ==
                '1'
                ? '0'
                : '1';
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'user_id': bussiness.USER_ID,
                        "bussiness_id": bussiness.BUSSINESS_ID,
                        'name': bussiness.DORSL,
                        'latitude': bussiness.LATITUDE,
                        'longitude': bussiness.LONGITUDE,
                        'bussiness_branch_id': bussiness.BUSSINESS_BRANCH_ID,
                        'address_first': bussiness.ADDRESS_FIRST,
                        'address_second': bussiness.ADDRESS_SECOND,
                        'postal_code': bussiness.POSTAL_CODE,
                        'city': bussiness.CITY,
                        'state': bussiness.STATE,
                        "home_service": hs
                    })
            }
            try {
                const response = await fetch(`${urlApi}bussiness`, options);
                const json = await response.json();
                if (json['sucess']) {
                    localStorage.setItem("dorsl", JSON.stringify(name));
                    setshowAlertConfirmation(true);
                    setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                    setTimeout(() => window.location.reload(), 3000);
                }
                else {
                    console.log(`No se pudo actulizar informacion de la empresa`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                setbAccederHS(true);
                return;
            }
            setbAccederHS(true);
        }
    };

    const ModCollaboratorGroupOpen = async (e) => {
        e.stopPropagation();
        if (bAccederCollaborator) {
            setbAccederCollaborator(false);
            //Enviar por POST
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'bussiness_id': businessId,
                        'user_id': `${selectUser}`,
                        'name': bussiness.DORSL
                    })
            }
            try {
                const response = await fetch(`${urlApi}collaboratorCreate`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}bussinessInfCol?bussiness_id=${businessId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setColaboraciones(json['data']);
                            var temp = usuariosbkq.filter((u) => !json['data'].some((c) => c.USER_ID == u.USER_ID));
                            setUsuarios(temp);
                            setsearchText('');
                        } else {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    }
                    catch (e) {
                        setSelectUser(null);
                        setbAccederCollaborator(true);
                        return;
                    }
                }
                setSelectUser(null);
                setbAccederCollaborator(true);
            }
            catch (e) {
                setSelectUser(null);
                setbAccederCollaborator(true);
                return;
            }
        }
    };

    const indexCancelar = async (ID) => {
        if (bAccederCollaborator) {
            setbAccederCollaborator(false);
            //Enviar por DELETE
            var options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'collaborator_id': `${ID}`
                    })
            }
            try {
                const response = await fetch(`${urlApi}collaboratorDelete`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAccederCollaborator(true);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}bussinessInfCol?bussiness_id=${businessId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setColaboraciones(json['data']);
                            var temp = usuariosbkq.filter((u) => !json['data'].some((c) => c.USER_ID == u.USER_ID));
                            setUsuarios(temp);
                            setsearchText('');
                            setbAccederCollaborator(true);
                        } else {
                            setbAccederCollaborator(true);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    }
                    catch (e) {
                        setbAccederCollaborator(true);
                        return;
                    }
                }
            }
            catch (e) {
                setbAccederCollaborator(true);
                return;
            }
        }
    };

    const ModCategoriaGroupOpen = async (e) => {
        e.stopPropagation();
        if (bussiness.SUBCATEGORY != sSubCategoriaName.label) {
            if (bAccederCategoria) {
                setbAccederCategoria(false);
                // searchIdCategoria();
                var auxIdC = sSubCategoriaName.value;
                //Enviar por PUT
                var options = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'user_id': bussiness.USER_ID,
                            "bussiness_id": bussiness.BUSSINESS_ID,
                            'name': bussiness.DORSL,
                            'latitude': bussiness.LATITUDE,
                            'longitude': bussiness.LONGITUDE,
                            'bussiness_branch_id': auxIdC,
                            'address_first': bussiness.ADDRESS_FIRST,
                            'address_second': bussiness.ADDRESS_SECOND,
                            'postal_code': bussiness.POSTAL_CODE,
                            'city': bussiness.CITY,
                            'state': bussiness.STATE,
                            "home_service": bussiness.HOME_SERVICE
                        })
                }
                try {
                    const response = await fetch(`${urlApi}bussiness`, options);
                    const json = await response.json();
                    if (json['sucess']) {
                        setshowAlertConfirmation(true);
                        setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                        setTimeout(() => window.location.reload(), 3000);
                    }
                    else {
                        console.log(`No se pudo actulizar informacion de la empresa`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                }
                catch (e) {
                    setbAccederCategoria(true);
                    return;
                }
                setbAccederCategoria(true);
            }
        }
    };

    const AddEspacioGroupOpen = async (e) => {
        e.stopPropagation();
        if (spaceNameAlias != '') {
            if (bAccederEspacio) {
                setbAccederEspacio(false);
                const sname = spaceNameFree == '' ? spaceName : spaceNameFree;
                //Enviar por POST
                var options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "bussiness_id": bussiness.BUSSINESS_ID,
                            'name_space': sname,
                            'alias': spaceNameAlias,
                        })
                }
                try {
                    const response = await fetch(`${urlApi}spaceBusiness`, options);
                    const json = await response.json();
                    if (json['sucess'] == false) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    else {
                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}spaceBusinessId?bussiness_id=${businessId}`);
                            if (response.status == 200) {
                                const json = await response.json();
                                setSpaces(json['data']);
                            } else {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                        }
                        catch (e) {
                            return;
                        }
                    }
                }
                catch (e) {
                    setSelectSpace(null);
                    setbAccederEspacio(true);
                    setSpaceName('Consultorio');
                    setSpaceNameAlias('');
                    setSpaceNameFree('');
                    return;
                }
                setSelectSpace(null);
                setbAccederEspacio(true);
                setSpaceName('Consultorio');
                setSpaceNameAlias('');
                setSpaceNameFree('');
            }
        }
    };

    const ModHorarioGroupOpen = () => {
        setHorarioGroup(!horarioGroup);
    };

    const ModAddressGroupOpen = async (e) => {
        e.stopPropagation();

        if (bussiness.ADDRESS_FIRST != direccionUno
            || bussiness.ADDRESS_SECOND != direccionDos
            || bussiness.POSTAL_CODE != codigoPostal
            || bussiness.CITY != ciudad
            || bussiness.STATE != estado) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'user_id': bussiness.USER_ID,
                        "bussiness_id": bussiness.BUSSINESS_ID,
                        'name': bussiness.DORSL,
                        'latitude': bussiness.LATITUDE,
                        'longitude': bussiness.LONGITUDE,
                        'bussiness_branch_id': bussiness.BUSSINESS_BRANCH_ID,
                        'address_first': direccionUno,
                        'address_second': direccionDos,
                        'postal_code': codigoPostal,
                        'city': ciudad,
                        'state': estado,
                        "home_service": bussiness.HOME_SERVICE
                    })
            }
            try {
                const response = await fetch(`${urlApi}bussiness`, options);
                const json = await response.json();
                if (json['sucess']) {
                    setshowAlertConfirmation(true);
                    setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                    setTimeout(() => window.location.reload(), 3000);
                }
                else {
                    console.log(`No se pudo actulizar informacion de la empresa`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }

    };

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };

    const handleChangeColonia = evt => {
        const value = evt.target.value;
        setDireccionDos(value);
    };

    function selectableTimePredicate() {
        var _dia = new Date();
        var tempHoras = [];
        for (let index = 0; index < 24; index++) {
            if (index < 7) {
                var Aux = new Date(_dia.getFullYear(), _dia.getMonth(), _dia.getDay(), index, '00', '00');
                tempHoras.push(Aux);
            }
            else if (index > 22 && index < 24) {
                var Aux = new Date(_dia.getFullYear(), _dia.getMonth(), _dia.getDay(), index, '00', '00');
                tempHoras.push(Aux);
            }
        }
        return tempHoras;
    }

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
                console.log(json['data']);
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
            setCodigoPostal(value);
            setColonias(tempcita);
            setEstado('');
            setCiudad('');
        }
    };

    const handleChangeName = evt => {
        const value = evt.target.value;
        setName(value);
    };

    const handleChangeImagen = evt => {
        const file = evt.target.files[0];
        if (file) {
            setImagenFile(file);
            setImagen(URL.createObjectURL(file));
            setbImagen(false);
        }
    }

    const handleSendImagen = async evt => {
        if (bAcceder) {
            setbAcceder(false);
            //Enviar al backend
            var options = new FormData();
            options.append('bussiness_id', bussiness.BUSSINESS_ID);
            options.append('image', imagenFile);
            try {
                const response = await fetch(`${urlApi}photoBussiness`, {
                    method: "PUT",
                    body: options,
                });
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAcceder(true);
                    setbImagen(true);
                    setImagenFile(null);
                    setImagen(null);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    setbAcceder(true);
                    setbImagen(true);
                }
            }
            catch (e) {
                setbAcceder(true);
                setbImagen(true);
                setImagenFile(null);
                setImagen(null);
                return;
            }
        }
    }

    function quitarAcentos(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const handleChangeUsrs = evt => {
        const tempList = [];
        const value = evt.target.value;
        setsearchText(value);
        for (var filName in usuarios) {
            var userName = `${usuarios[filName].first_name} ${usuarios[filName].last_name}`;
            if (quitarAcentos(userName.toLowerCase()).startsWith(value.toLowerCase())) {
                tempList.push(usuarios[filName]);
            }
        }
        setfilteredNames(tempList);
    };

    useEffect(() => {
        const fData = async () => {
            if (businessId == '') {
                navigate("/");
            }
            else if (businessAdmin == false) {
                navigate("/");
            }
            else if (sCorreo == null && sPassword == null) {
                navigate("/");
            }
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    setBussiness(json['data']);
                    setName(json['data']['DORSL']);
                    const userId = json['data']['USER_ID'];
                    setCategoriaName(json['data']['CATEGORY']);
                    setSubCategoriaName({
                        value: json['data']['BUSSINESS_BRANCH_ID'],
                        label: json['data']['SUBCATEGORY'] ?? ''
                    }
                    );
                    setCategoriaId(json['data']['BUSSINESS_BRANCH_ID']);
                    setDireccionUno(json['data']['ADDRESS_FIRST']);
                    setDireccionDos(json['data']['ADDRESS_SECOND']);
                    setCodigoPostal(json['data']['POSTAL_CODE']);
                    setCiudad(json['data']['CITY']);
                    setEstado(json['data']['STATE']);
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}schedule?bussinessId=${businessId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setHorario(json['data']);
                            setExcludeTimes(selectableTimePredicate());
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
                                        values.map((subCat) => {
                                            tempSubCategoria.push({
                                                value: subCat.id,
                                                label: subCat.subname ?? ''
                                            });
                                        });
                                    }
                                }
                                setsubCategorias(tempSubCategoria);
                                //Solicitar por GET
                                try {
                                    const response = await fetch(`${urlApi}users?user_id=${userId}`);
                                    if (!response.ok) {
                                        console.log(`Error getting empresas.`);
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    const json2 = await response.json();
                                    setUsuariosbkq(json2['data']);
                                    //Solicitar por GET
                                    try {
                                        const response = await fetch(`${urlApi}bussinessInfCol?bussiness_id=${businessId}`);
                                        if (response.status == 200) {
                                            const json = await response.json();
                                            setColaboraciones(json['data']);

                                            var temp = json2['data'].filter((u) => !json['data'].some((c) => c.USER_ID == u.USER_ID));
                                            setUsuarios(temp);
                                        } else {
                                            throw new Error(`HTTP error! status: ${response.status}`);
                                        }
                                        //Solicitar por GET
                                        try {
                                            const response = await fetch(`${urlApi}spaceBusinessId?bussiness_id=${businessId}`);
                                            if (response.status == 200) {
                                                const json = await response.json();
                                                setSpaces(json['data']);
                                            } else {
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
                            console.log(`Error getting schedule.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">
            {showAlertConfirmation && (
                <div className="absolute top-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
                    Es posible que este cambio tarde unos minutos en reflejarse en todos lados.
                </div>
            )}
            <div className="max-w-3xl mx-auto mt-20 p-6 space-y-6 text-gray-800">
                {/* Imagen usuario */}
                <div className="flex justify-center mb-6">
                    {bussiness.PHOTO == null ? (
                        <div className='relative inline-block'>
                            {imagen ? <img className="w-32 h-32 rounded-full object-cover border"
                                src={imagen} /> :
                                <img className="w-32 h-32 rounded-full object-cover border"
                                    src={PersonIcon} />}
                            {/* Icono de la imagen */}
                            {bimagen ?
                                <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'>
                                    <CameraIcon className="h-5 w-5 text-white" />
                                    <input type="file" accept="image/*" className='hidden' onChange={handleChangeImagen} />
                                </label> : bAcceder ?
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'
                                        onClick={handleSendImagen}>
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </label> :
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2'>
                                        <div className='circlePh' ></div>
                                    </label>}
                        </div>
                    ) : (
                        <div className='relative inline-block'>
                            <img className="w-32 h-32 rounded-full object-cover border"
                                src={imagen || 'data:image/jpeg;base64,' + arrayBufferToBase64(bussiness.PHOTO['data'])} />
                            {/* Icono de la imagen */}
                            {bimagen ?
                                <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'>
                                    <CameraIcon className="h-5 w-5 text-white" />
                                    <input type="file" accept="image/*" className='hidden' onChange={handleChangeImagen} />
                                </label> : bAcceder ?
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'
                                        onClick={handleSendImagen}>
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </label> :
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2'>
                                        <div className='circlePh' ></div>
                                    </label>}

                        </div>
                    )}
                </div>
                {/* Grupo Nombre */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setNameGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <BuildingOfficeIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Nombre</span>
                        </div>
                        {nameGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {bAccederName ? (!nameGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre de la empresa</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Ingresa el nuevo nombre de tu empresa' value={name} onChange={handleChangeName} required />
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={bussiness.DORSL != name ? false : true}
                                onClick={ModNameGroupOpen}>Guardar</button>
                        </div>
                    )) : <div className="mt-4 space-y-4">
                        <div className='circle' ></div>
                    </div>}
                </div>
                {/* Grupo Categoria */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setCategoriaGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <Squares2X2Icon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Categoria</span>
                        </div>
                        {categoriaGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {bAccederCategoria ? (!categoriaGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">¿Que tipo de negocio tienes?</label>
                                <Select
                                    value={sSubCategoriaName}
                                    onChange={setSubCategoriaName}
                                    options={subCategorias}
                                    placeholder='Selecciona una opción'
                                    isSearchable={false}
                                />
                                <span>Esto ayuda a que los clientes te encuentren si están buscando una empresa como la tuya.</span>
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={bussiness.SUBCATEGORY != sSubCategoriaName.label ? false : true}
                                onClick={ModCategoriaGroupOpen}>Guardar</button>
                        </div>
                    )) : <div className="mt-4 space-y-4">
                        <div className='circle' ></div>
                    </div>}
                </div>
                {/* Grupo Espacios */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setEspacioGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <RectangleGroupIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Espacio de servicio</span>
                        </div>
                        {espacioGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {bAccederEspacio ? (!espacioGroup && (
                        <div className="mt-4 space-y-4">
                            {/* Lista de Espacios */}
                            {spaces.length > 0 ? spaces.map((index) => (
                                <div className={`font-semibold py-2 px-2 rounded-md shadow-md transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl flex items-center justify-between
                                            ${selectSpace == index.BUS_SPACES_ID ? "bg-orange-500" : "bg-white hover:bg-gray-200"}`}
                                    onClick={() => {
                                        setSelectSpace(selectSpace == index.BUS_SPACES_ID ? null : index.BUS_SPACES_ID);
                                    }}
                                >
                                    <div className="flex items-center space-x-4" >
                                        <TagIcon className="w-6 h-6 text-orange-700 ml-2" />
                                        <div className='flex flex-col'>
                                            <label className="text-black">{index.ALIAS}</label>
                                            <p className={`${selectSpace == index.BUS_SPACES_ID ? "text-white" : "text-gray-400"}`}>{index.NAME_SPACE}</p>
                                        </div>
                                    </div>
                                    {selectSpace == index.BUS_SPACES_ID ?
                                        <PencilSquareIcon className="w-6 h-6 text-white mr-4"
                                            onClick={() => {
                                                navigate("/updateSpace", { state: { space: index, businessId: businessId } });
                                            }} /> : <></>}
                                </div>
                            )) : <></>}
                            <div>
                                <label className="block text-sm font-medium mb-1">¿Cómo quieres llamar a tus espacios de atención?</label>
                                <select
                                    name="space_name"
                                    onChange={(e) => {
                                        setSpaceName(e.target.value); setSpaceNameFree(''); setSpaceNameAlias('');
                                    }}
                                    className="w-full border px-4 py-2 rounded-md"
                                >
                                    <option>Consultorio</option>
                                    <option>Espacio</option>
                                    <option>Estación</option>
                                    <option>Cabina</option>
                                    <option>Silla</option>
                                    <option>Sala</option>
                                    <option>Personalizado (Campo libre)</option>
                                </select>
                                {
                                    spaceName == 'Personalizado (Campo libre)' && <>
                                        <label className="block text-sm font-medium mb-1 mt-1">Campo libre</label>
                                        <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder="Ejemplo: Área de estética, Área dental" value={spaceNameFree} onChange={(e) => setSpaceNameFree(e.target.value)} required />
                                    </>
                                }
                                <label className="block text-sm font-medium mb-1 mt-1">Alias</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder="Ejemplo: Lic. Carolina - Psicólogo " value={spaceNameAlias} onChange={(e) => setSpaceNameAlias(e.target.value)} required />
                                {spaceNameAlias == '' && <p className="mt-1 text-xs text-red-600">El Alias es obligatorio.</p>}
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={spaceNameAlias != '' ? spaceName == 'Personalizado (Campo libre)' ? spaceNameFree != '' ? false : true : false : true}
                                onClick={AddEspacioGroupOpen}>Agregar</button>
                        </div>
                    )) : <div className="mt-4 space-y-4">
                        <div className='circle' ></div>
                    </div>}
                </div>
                {/* Grupo Collaborator */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setCollaboratorGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <UserPlusIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Invitar Colaborador</span>
                        </div>
                        {CollaboratorGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {bAccederCollaborator ? (!CollaboratorGroup && (
                        <div className="mt-4 space-y-4">
                            {/* Lista de Colaboradores */}
                            {colaboraciones.length > 0 ? colaboraciones.map((index) => (
                                <div className="font-semibold py-2 px-2 rounded-md shadow-md transition flex items-center justify-between">
                                    <div className="flex items-center space-x-4" >
                                        {
                                            index['PHOTO'] == null ? <UserCircleIcon width={40} color={'#fc6500'} className="ml-2" /> :
                                                <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                        }
                                        <div className='flex flex-col'>
                                            <label className="text-black">{index.COMPLET_NAME}</label>
                                            {index.CONFIRM == 0 ? <p className="text-gray-400">Invitación enviada</p> : <></>}
                                        </div>
                                    </div>
                                    <button className={`ml-2 text-sm text-certer w-20 px-2 py-1 rounded-lg text-white transition ${index.CONFIRM == 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                                        onClick={() => (indexCancelar(index.ID))} >{index.CONFIRM == 0 ? 'Cancelar' : 'Quitar'}</button>
                                </div>
                            )) : <></>}
                            {/* Buscador */}
                            <div className="relative mb-10">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id='searchInput'
                                    type="text"
                                    name="searchText"
                                    value={searchText}
                                    onChange={handleChangeUsrs}
                                    placeholder="Buscar cliente..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm ring-1 ring-gray-600 focus:ring-2 focus:ring-orange-400 outline-none text-gray-800 placeholder-gray-400 transition"
                                />
                            </div>
                            {/* Resultados o sugerencias */}
                            {searchText !== "" ? (usuarios &&
                                // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col grap-3">
                                    {filteredNames.map((index) => (
                                        <div className={` font-semibold py-2 px-2 rounded-md shadow-md transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl flex items-center justify-between
                                            ${selectUser == index.USER_ID ? "bg-orange-500 text-white" : "bg-white hover:bg-gray-200 text-orange-500"}`}
                                            key={index.USER_ID}
                                            onClick={() => {
                                                setSelectUser(selectUser == index.USER_ID ? null : index.USER_ID);
                                            }}
                                        >
                                            <div className="flex items-center space-x-4" >
                                                {
                                                    index['PHOTO'] == null ? <UserCircleIcon width={40} color={selectUser == index.USER_ID ? '#fff' : '#fc6500'} className="ml-2" /> :
                                                        <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                                }
                                                <label className={`${selectUser == index.USER_ID ? "text-white" : "text-black"}`}>{index['first_name']} {index.last_name}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <></>}
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={selectUser != null ? false : true}
                                onClick={ModCollaboratorGroupOpen}>Invitar</button>
                        </div>
                    )) : <div className="mt-4 space-y-4">
                        <div className='circle' ></div>
                    </div>}
                </div>
                {/* Grupo Horario */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(ModHorarioGroupOpen)}
                    >
                        <div className="flex items-center gap-2">
                            <ClockIcon className='w-5 h-5 text-orange-600' />
                            {horario.length == 0 ? <span className="font-semibold">Agrega tu horario</span> : <span className="font-semibold">Actualización de horario</span>}
                        </div>
                        {horarioGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!horarioGroup && (
                        horario.length == 0 ?
                            <RegisterSchedule excludeTimes={_excludeTimes} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} /> :
                            <UpdateSchedule excludeTimes={_excludeTimes} horario={horario} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} />

                    )}
                </div>
                {/* Grupo Home Services */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(sethomeServiceGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <HomeIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Servicio a domicilio</span>
                        </div>
                        {homeServiceGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {bAccederHS ? (!homeServiceGroup && (
                        <div className="mt-4 space-y-4">
                            <div className='flex'>
                                <label className="block text-sm font-medium mb-1 mr-4">¿Quieres aceptar citas a domicilio?</label>
                                <label className="switch">
                                    <input type="checkbox" onClick={ModHomeServiceGroupOpen}
                                        checked={bussiness.HOME_SERVICE ==
                                            '1'
                                            ? true
                                            : false} />
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    )) : <div className="mt-4 space-y-4">
                        <div className='circle' ></div>
                    </div>}
                </div>
                {/* Grupo Direccion */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setAddressGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <MapPinIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Dirección</span>
                        </div>
                        {addressGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!addressGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Código postal</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Código postal' maxLength={5} value={codigoPostal} onChange={getCodigoPostal} />
                                <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label>
                                <label className="block text-sm font-medium mb-1">Estado</label>
                                <input className="w-full border px-4 py-2 rounded-md --placeholder" type="text" placeholder='Estado' value={estado} disabled />
                                <label className="block text-sm font-medium mb-1">Municipio/Ciudad</label>
                                <input className="w-full border px-4 py-2 rounded-md --placeholder" type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                                <label className="block text-sm font-medium mb-1">Colonia</label>
                                <input className="w-full border px-4 py-2 rounded-md" list="optionsList" type="text" placeholder='Colonia'
                                    disabled={colonias.length == 0 ? true : false}
                                    onChange={handleChangeColonia} value={direccionDos} required ></input>
                                <datalist id="optionsList">
                                    {colonias.map((option, index) => (
                                        <option key={index} value={option} />
                                    ))}
                                </datalist>
                                <label className="block text-sm font-medium mb-1">Calle / Número externo</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Calle / Número externo' value={direccionUno} onChange={handleChange} />
                            </div>

                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={
                                    bussiness.ADDRESS_FIRST != direccionUno
                                        || bussiness.ADDRESS_SECOND != direccionDos
                                        || bussiness.POSTAL_CODE != codigoPostal
                                        || bussiness.CITY != ciudad
                                        || bussiness.STATE != estado ? false : true} onClick={ModAddressGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>);
}

export default ViewUpdateBusiness;