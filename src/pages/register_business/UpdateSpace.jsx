
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
// assets
import { urlApi } from "../../styles/Constants.jsx";
import Loaging from '../../components/Loading.jsx';
import RegisterSchedule from '../schedule/register_schedule.jsx';
import UpdateSchedule from '../schedule/update_schedule.jsx';
// Library
import { PencilSquareIcon } from '@heroicons/react/24/solid';


// loader
export function UpdateSpaceLoader() {

    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function UpdateSpace() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [editSpace, setEditSpace] = useState(true);
    const [bAccederEdit, setbAccederEdit] = useState(true);
    const [bAcceder, setbAcceder] = useState(false);
    const [spaceName, setSpaceName] = useState('Consultorio');
    const [spaceNameFree, setSpaceNameFree] = useState('');
    const [spaceNameAlias, setSpaceNameAlias] = useState('');
    const space = location.state?.space ?? '';
    const businessId = location.state?.businessId ?? '';
    const [horario, setHorario] = useState([]);
    const [_excludeTimes, setExcludeTimes] = useState([]);
    const [showAlertConfirmation, setshowAlertConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);
    const formRef = useRef(null);

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
    const _buildEditSpace = async () => {
        if (bAccederEdit) {
            setbAccederEdit(false);
            var sname = '';
            if(spaceName == 'Personalizado (Campo libre)')
                sname = spaceNameFree;
            else {
                sname = spaceName;
            } 
            // Enviar por POST
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'bussiness_id': businessId,
                        'busSpacesId': space.BUS_SPACES_ID,
                        'name_space': sname,
                        'alias': spaceNameAlias
                    })
            }
            // console.log('options');
            // console.log(options);
            try {
                const response = await fetch(`${urlApi}spaceBusiness`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAccederEdit(true);
                    toast.error('Ocurrió un error al guardar. Intenta de nuevo.');

                } else {
                    navigate(-1);
                }
            }
            catch (e) {
                navigate("/error");
                setbAccederEdit(true);
                return;
            }
        }
    }

    useEffect(() => {
        const fData = async () => {
            // Validaciones tempranas (early return)
            if (businessId == '') {
                navigate("/");
            }
            else if (space == '') {
                navigate("/");
            }
            else if (!sCorreo || !sPassword) {
                navigate("/");
                return;
            }
            const espacios = ['Consultorio', 'Espacio', 'Estación', 'Cabina', 'Silla', 'Sala'];
            if (!espacios.includes(space.NAME_SPACE)) {
                setSpaceName('Personalizado (Campo libre)');
                setSpaceNameFree(space.NAME_SPACE);
            } else {
                setSpaceName(space.NAME_SPACE);
            }
            setSpaceNameAlias(space.ALIAS);
            // console.log(space);
            // console.log(businessId);
            try {
                const response = await fetch(`${urlApi}schedule?bussinessId=${businessId}&busSpacesId=${space.BUS_SPACES_ID}`);
                if (response.status == 200) {
                    const json = await response.json();
                    setHorario(json['data']);
                    setExcludeTimes(selectableTimePredicate());
                } else if (response.status == 404) {
                    const json = await response.json();
                    setHorario([]);
                }
                else {
                    console.log(`Error getting bussinessId.`);
                }
                setLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 py-8 px-4 sm:px-6 lg:px-8">
            {showAlertConfirmation && (
                <div className="absolute top-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
                    Es posible que este cambio tarde unos minutos en reflejarse en todos lados.
                </div>
            )}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Preview Card Space */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-end">
                            {editSpace &&
                                (<button
                                    onClick={() => setEditSpace(false)}>
                                    <PencilSquareIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                </button>)
                            }
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                {!editSpace ? <h3 className="mt-3 text-lg font-bold text-gray-900"> Editar espacio de servicio </h3>
                                    : <h3 className="mt-3 text-lg font-bold text-gray-900"> {space.ALIAS || 'Espacio de servicio'} </h3>}
                                {!editSpace ? <></>
                                    : <p className="text-sm text-gray-700">
                                        <strong>Tipo:</strong> {space.NAME_SPACE || ''}
                                    </p>}
                            </div>
                            <div className="text-xs text-gray-400">Vista previa</div>
                        </div>
                        {!editSpace ?
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">¿Cómo quieres llamar a tu espacio de atención?</label>
                                        <select
                                            name="space_name"
                                            value={spaceName}
                                            onChange={(e) => {
                                                setSpaceName(e.target.value); 
                                                // setSpaceNameFree('');
                                                // setSpaceNameAlias('');
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
                                </div>
                            </div>
                            : <></>}

                        <hr className="my-4 border-gray-200" />

                        {!editSpace ?
                            <div className="flex gap-3 mt-4">
                                {bAccederEdit ?
                                    <button className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-500"
                                        disabled={spaceName == 'Personalizado (Campo libre)' ? space.ALIAS != spaceNameAlias ? false : space.NAME_SPACE != spaceNameFree ? false : true : space.ALIAS != spaceNameAlias ? false : space.NAME_SPACE != spaceName ? false : true}
                                        onClick={() => {
                                            _buildEditSpace();
                                        }}>
                                        Actualizar
                                    </button>
                                    :
                                    <button className="px-3 py-1 text-sm rounded-lg bg-green-300">
                                        <span className="animate-pulse">Procesando...</span>
                                    </button>
                                }
                                <button className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                                    onClick={() => setEditSpace(!editSpace)}>
                                    Cancelar
                                </button>
                            </div>
                            : <div className="flex items-center justify-between mt-3">
                                <button
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    onClick={() => {
                                        setbAcceder(true);
                                        setTimeout(() => {
                                            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 100);
                                    }}
                                >
                                    {horario.length == 0 ? 'Agrega tu horario' : 'Actualización de horario'}
                                </button>
                            </div>
                        }
                    </div>
                </div>
                {/* Horario */}
                {bAcceder && <div ref={formRef} className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                {horario.length == 0 ? <h3 className="text-lg font-semibold text-gray-900">Agregar</h3> : <h3 className="text-lg font-semibold text-gray-900">Actualización</h3>}
                                <div className="text-xs text-red-500 cursor-pointer" onClick={() => {
                                    // setbEnviar(true);
                                    setbAcceder(false);
                                    // setSubmitted(false);
                                }}>cancelar</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                            {horario.length == 0 ?
                                <RegisterSchedule excludeTimes={_excludeTimes} businessId={businessId} setshowAlertConfirmation={setshowAlertConfirmation} busSpacesId={space.BUS_SPACES_ID}/> :
                                <UpdateSchedule excludeTimes={_excludeTimes} horario={horario} businessId={businessId} setshowAlertConfirmation={setshowAlertConfirmation} busSpacesId={space.BUS_SPACES_ID} />
                            }
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    );
}

export default UpdateSpace;