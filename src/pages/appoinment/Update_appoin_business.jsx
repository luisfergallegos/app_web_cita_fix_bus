// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
// assets
// import './Add_appoin.css';
import '../../components/Loading.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
registerLocale("es", es);
import User from "../../assets/e.png";
import {
    BarsArrowUpIcon,
    CalendarDateRangeIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon, PhoneIcon,
    TrashIcon,
    XMarkIcon as CloseIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PencilSquareIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';

// loader
export async function UpdateAppoinLoader({ params }) {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const citaId = params.id;
    return { sCorreo, sPassword, citaId };
}

export function UpdateAppoinBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, citaId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [loadingRe, setLoadingRe] = useState(false);
    const [cita, setCita] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenU, setIsOpenU] = useState(false);
    const [message, setMessage] = useState('');
    const [bPopupMenuButton, setPopupMenuButton] = useState(false);
    const [bMostrarEditar, setbMostrarEditar] = useState(false);
    const [citaDetalle, setCitaDetalle] = useState([]);
    const [citaAddress, setCitaAddress] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [selectedTime, setselectedTime] = useState('');
    const [selectedIndex, setselectedIndex] = useState();
    const [_excludeDates, setExcludeDates] = useState([]);
    const [citas, setCitas] = useState([]);
    const [citaDate, setcitaDate] = useState([]);
    const [bAcceder, setbAcceder] = useState(true);
    var _today = new Date();
    const [initialDate, setinitialDate] = useState(new Date(_today));
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));
    const [flagAnonPhone, setFlagAnonPhone] = useState('');
    const [citasHis, setCitasHis] = useState([]);
    const [viewCalendario, setViewCalendario] = useState(false);


    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const ExampleCustomInput = forwardRef(
        ({ onClick, className }, ref) => (
            <label className={className} onClick={onClick} ref={ref}>
                {startDate ? <p>{dateSpanish(startDate)}</p> :
                    <p>Selecciona una fecha</p>
                }
                {selectedTime ? <p>{selectedTime}</p> :
                    <p>Selecciona una hora</p>
                }
            </label>
        ),
    );

    function SelectDateTime(date) {
        var tempcita = [];
        for (let index = 0; index < citas.length; index++) {
            var parts = citas[index]['APPOINTMENT_DATE'].split('-');
            var formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);
            if (formattedDate.toLocaleDateString() == date.toLocaleDateString()) {
                tempcita.push(citas[index]['APPOINTMENT']);
            }
        }
        setcitaDate(tempcita);
    }

    function selectableDayPredicate(_dias) {
        var tempdias = [];
        //Convert String to Date
        if (_dias.length !== 0) {
            for (let index = 0; index < _dias.length; index++) {
                //console.log(_dias[index]);
                var diaAux = parseInt(_dias[index].substring(0, 2));
                var MesAux = parseInt(_dias[index].substring(3, 5)) - 1;
                var AñoAux = parseInt(_dias[index].substring(6, 10));
                //console.log(diaAux+'_'+MesAux+'_'+AñoAux);
                var Aux = new Date(AñoAux, MesAux, diaAux);
                tempdias.push(Aux);
            }
        }
        return tempdias;
    }

    const getDaysInactive = async () => {
        setLoadingRe(true);
        if (cita.ID_SPACE == '') {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${cita.BUSSINESS_ID}`);
                if (!response.ok) {
                    console.log(`Error getting appoinBussDateDays.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json['data']));

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${cita.BUSSINESS_ID}`);
                    if (!response.ok) {
                        console.log(`Error getting appoinBussDate.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const json = await response.json();
                    setCitas(json['data']);
                    setLoadingRe(false);
                }
                catch (e) {
                    setLoadingRe(false);
                    return;
                }
            }
            catch (e) {
                setLoadingRe(false);
                return;
            }
        } else {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${cita.BUSSINESS_ID}&busSpacesId=${cita.ID_SPACE}`);
                if (!response.ok) {
                    console.log(`Error getting appoinBussDateDays.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json['data']));

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${cita.BUSSINESS_ID}&busSpacesId=${cita.ID_SPACE}`);
                    if (!response.ok) {
                        console.log(`Error getting appoinBussDate.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const json = await response.json();
                    setCitas(json['data']);
                    setLoadingRe(false);
                }
                catch (e) {
                    setLoadingRe(false);
                    return;
                }
            }
            catch (e) {
                setLoadingRe(false);
                return;
            }
        }


    }

    function ConvertDateTime(date, time, flag) {
        var parts = date.split('-');
        var partsTime = time.split(':');
        var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
        const timeString = formattedDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        if (flag == 0) {
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const _buildConfirm = async () => {
        if (bAcceder) {
            setbAcceder(false);
            setIsOpenU(false);

            var dateFormat = startDate.getMonth() + 1;
            var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
            var anonimo = cita.ANONIMO.length == 0 ? '' : cita.ANONIMO;
            const bus_spaces_id = cita.ID_SPACE == '' ? null : cita.ID_SPACE;

            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'apoinment_id': cita.APOINMENT_ID,
                        'user_id': cita.USER_ID,
                        'bussiness_id': cita.BUSSINESS_ID,
                        'usernotification_id': cita.USER_ID,
                        'appointment_date': _selectedDate,
                        'appointment_time': selectedTime,
                        'anonimo': anonimo,
                        'message': message,
                        'estatus': '1',
                        'dorsl': cita.DORSL,
                        'bus_spaces_id': bus_spaces_id
                    })
            }
            try {
                const response = await fetch(`${urlApi}appoin`, options);
                const json = await response.json();
                // =====================================
                // 1. Reagendamiento correcto
                // =====================================
                if (response.ok && json.sucess === true) {
                    if (json.data?.updated === false) {
                        toast.info("La cita ya contiene esta información.");
                    } else {
                        toast.success("Cita actualizada correctamente.");
                    }
                    setIsOpenU(false);
                    navigate("/home");
                    return;
                }
                // =====================================
                // 2. Horario ocupado
                // =====================================
                if (response.status === 409 || (response.status === 200 && json.sucess === false && Number(json.data) > 0)) {
                    toast.error(`Ya no se encuentra disponible Fecha: ${_selectedDate} Hora: ${selectedTime}.`);
                    getDaysInactive();
                    return;
                }
                // =====================================
                // 3. Cita no encontrada
                // =====================================
                if (response.status === 404) {
                    toast.error(json.message || json.json || "No fue posible encontrar la cita.");
                    return;
                }
                // =====================================
                // 4. Otros errores del API
                // =====================================
                console.error("Error actualizando cita:", json);
                toast.error(json.message || json.json || "No fue posible actualizar la cita.");
            }
            catch (error) {
                console.error("Error de conexión:", error);
                toast.error("Error de conexión. Verifica si la cita se actualizó antes de volver a intentarlo.");
            } finally {
                setbAcceder(true);
            }
        }

    };

    const _buildCancelar = async () => {
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.USER_ID}&dorsl=${cita.DORSL}&for_who=Usr`, options);
            const json = await response.json();
            // ====================================
            // 1. Cancelación correcta
            // ====================================
            if (response.ok && json.sucess === true) {
                toast.success("Cita cancelada correctamente.");
                navigate("/home");
                return;
            }
            // ====================================
            // 2. Cita ya cancelada
            // ====================================
            if (response.status === 409) {
                toast.info( typeof json.data === "string" ? json.data : "Esta cita ya se encontraba cancelada." );
                navigate("/home");
                return;
            }
            // ====================================
            // 3. Cita no encontrada
            // ====================================
            if (response.status === 404) {
                toast.error("La cita ya no existe.");
                return;
            }
            // ====================================
            // 4. Otros errores
            // ====================================
            console.error("Error cancelando cita:", json);
            toast.error( json.message || json.json || (typeof json.data === "string" ? json.data : null) || "No fue posible cancelar la cita.");
        } catch (error) {
            console.error("Error de conexión:", error);
            toast.error("Error de conexión. Verifica el estado de la cita antes de volver a intentarlo.");
        } finally {
            setIsOpen(false);
        }
    };

    const handleChangeMessage = evt => {
        const value = evt.target.value;
        setMessage(value);
    };

    const ModPopupMenu = () => {
        setPopupMenuButton(!bPopupMenuButton);
    };

    const ModMostrarEditar = () => {
        setbMostrarEditar(!bMostrarEditar);
    };

    const GetHistorial = async (bus, usr) => {
        //Solicitar por GET
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        try {
            const response = await fetch(`${urlApi}appBusUsr?bussiness_id=${bus}&user_id=${usr}`, options);
            if (response.status == 200) {
                const json = await response.json();
                setCitasHis(json.data);
            } else if (response.status == 404) {
                setCitasHis([]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (e) {
            console.log('catch ' + e.message);
        }
    };

    const STATUS_CONFIG = {
        '-1': { label: 'Cancelada', color: 'text-red-500', icon: XCircleIcon },
        '0': { label: 'Nueva', color: 'text-sky-400', icon: ClockIcon },
        '1': { label: 'Modificada', color: 'text-blue-700', icon: PencilSquareIcon },
        '2': { label: 'Finalizada', color: 'text-gray-400', icon: CheckCircleIcon },
        '3': { label: 'Actual', color: 'text-blue-500', icon: ArrowPathIcon },
    };

    const getStatusInfo = (status) =>
        STATUS_CONFIG[status] || { label: 'Desconocido', color: 'text-gray-400', icon: ClockIcon };


    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}getAppoin?apoinment_id=${citaId}`);
                if (!response.ok) {
                    console.log(`Error getting getAppoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                const FLAG_ADDRESS = json['data']['FLAG_ADDRESS'];
                setCita(json['data']);
                await GetHistorial(json['data']['BUSSINESS_ID'], json['data']['USER_ID']);
                var temp = json['data']['ANONIMO'].substring(json['data']['ANONIMO'].indexOf(",") + 1, json['data']['ANONIMO'].length) ?? '';
                const cleanNumber = temp.replace(/\D/g, '');
                if (!isNaN(cleanNumber)) {
                    setFlagAnonPhone(cleanNumber);
                }

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}getAppoinDetail?apoinment_id=${citaId}`);
                    if (response.status == 404) {
                        setCitaDetalle([]);
                        setLoading(false);
                    } else if (response.status == 200) {
                        const json = await response.json();
                        setCitaDetalle(json['data']);
                        if (FLAG_ADDRESS == '1') {
                            //Solicitar por GET
                            try {
                                const response = await fetch(`${urlApi}getAppoinAddress?apoinment_id=${citaId}`);
                                if (!response.ok) {
                                    console.log(`Error getting getAppoinAddress.`);
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                const json = await response.json();
                                setCitaAddress(json['data']);
                                setLoading(false);
                            }
                            catch (e) {
                                return;
                            }
                        }
                        else {
                            setLoading(false);
                        }
                    } else {
                        console.log(`Error getting getAppoinDetail.`);
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
        if (sCorreo == null && sPassword == null) {
            navigate("/home");
        }
        fData();
    }, []);

    useEffect(() => {
        if (!bMostrarEditar || !startDate) {
            setcitaDate([]);
            return;
        }

        const horarios = citas.find(item => {
            const [year, month, day] = item.APPOINTMENT_DATE
                .split('-')
                .map(Number);

            const fecha = new Date(year, month - 1, day);

            return fecha.toDateString() === startDate.toDateString();
        });

        setcitaDate(horarios ? [horarios.APPOINTMENT] : []);

    }, [citas, startDate, bMostrarEditar]);

    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = cita.USER_PHOTO?.data ? arrayBufferToBase64(cita.USER_PHOTO.data) : '';
    const anonymous = Boolean(cita.ANONIMO);
    const customerName = anonymous ? cita.ANONIMO.split(',')[0] : cita.USER_NAME;
    const contact = anonymous ? cita.ANONIMO.split(',').slice(1).join(',').trim() : (cita.USER_PHONE || cita.USER_EMAIL || '');
    const phone = contact.replace(/\D/g, '');
    const hasPhone = anonymous ? phone.length >= 10 : Boolean(cita.USER_PHONE);
    const statusInfo = getStatusInfo(cita.ESTATUS);
    const StatusIcon = statusInfo.icon;
    const isFinished = Number(cita.ESTATUS) === 2 || Number(cita.ESTATUS) === -1;
    const dateText = ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0);
    const timeText = ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1);
    const addressText = [citaAddress.ADDRESS_FIRST, citaAddress.ADDRESS_SECOND, citaAddress.POSTAL_CODE, citaAddress.CITY, citaAddress.STATE, 'México'].filter(Boolean).join(', ');

    const startReschedule = () => {
        if (bMostrarEditar) {
            setbMostrarEditar(false);
            return;
        }
        const [year, month, day] = cita.APPOINTMENT_DATE.split('-').map(Number);
        const originalDate = new Date(year, month - 1, day);
        setinitialDate(new Date());
        setStartDate(originalDate);
        setselectedTime('');
        setMessage(cita.MENSSAGE || cita.MESSAGE || '');
        setselectedIndex(undefined);
        getDaysInactive();
        setbMostrarEditar(true);
    };

    const validateReschedule = () => {
        if (!startDate) return toast.error('Selecciona una fecha.');
        if (!selectedTime) return toast.error('Selecciona una hora.');
        const [year, month, day] = cita.APPOINTMENT_DATE.split('-').map(Number);
        const sameDay = startDate.getFullYear() === year && startDate.getMonth() + 1 === month && startDate.getDate() === day;
        if (sameDay && selectedTime === String(cita.APPOINTMENT_TIME).slice(0, 5)) {
            return toast.error('Selecciona una fecha u hora diferente.');
        }
        setIsOpenU(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-100">
                        <span aria-hidden="true">←</span> Volver a la agenda
                    </button>
                    <span className="text-xs font-medium text-slate-400">Cita #{cita.APOINMENT_ID}</span>
                </div>

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Gestión de reservaciones</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Detalle de la cita</h1>
                        <p className="mt-1 text-sm text-slate-500">Consulta la información y administra esta reservación.</p>
                    </div>
                    <div className={`inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200 ${statusInfo.color}`}>
                        <StatusIcon className="h-5 w-5" /> {statusInfo.label}
                    </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
                    <div className="space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-orange-50/60 px-5 py-5 sm:px-7">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-700">Fecha y horario</p>
                                <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                    <div className="flex items-center gap-3"><CalendarDateRangeIcon className="h-8 w-8 text-orange-500" /><div><p className="text-xs text-slate-500">Día de la cita</p><p className="text-lg font-bold text-slate-900">{dateText}</p></div></div>
                                    <div className="flex items-center gap-3"><ClockIcon className="h-8 w-8 text-orange-500" /><div><p className="text-xs text-slate-500">Hora</p><p className="text-lg font-bold text-slate-900">{timeText}</p></div></div>
                                </div>
                            </div>
                            <div className="px-5 py-5 sm:px-7">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Espacio de servicio</p>
                                <p className="mt-1 font-semibold">{cita.ALIAS || 'Sin espacio asignado'}</p>
                                {cita.NAME_SPACE && <p className="text-sm text-slate-500">{cita.NAME_SPACE}</p>}
                                {(cita.MENSSAGE || cita.MESSAGE) && <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Motivo de visita / servicio</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{cita.MENSSAGE || cita.MESSAGE}</p></div>}
                            </div>
                        </section>

                        {cita.FLAG_ADDRESS != '0' && addressText && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-3 flex items-center gap-2 text-base font-bold"><MapPinIcon className="h-5 w-5 text-orange-500" /> Visita a domicilio</h2>
                            <p className="text-sm text-slate-600">{addressText}</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-orange-600 hover:underline">Abrir ubicación ↗</a>
                        </section>}

                        {citaDetalle?.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-4 text-base font-bold">Seguimiento de la cita</h2>
                            <div className="space-y-3">{citaDetalle.map((detail, idx) => <div key={idx} className="flex items-center gap-3 text-sm"><InformationCircleIcon className="h-5 w-5 shrink-0 text-orange-500" /><span className="text-slate-600">{detail.STATUS_DETAIL}</span></div>)}</div>
                        </section>}

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-4 text-base font-bold">Historial de citas</h2>
                            {citasHis.filter(item => String(item.APOINMENT_ID) !== String(cita.APOINMENT_ID)).length === 0 ? (
                                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No hay citas anteriores para mostrar.</p>
                            ) : <div className="divide-y divide-slate-100">{citasHis.filter(item => String(item.APOINMENT_ID) !== String(cita.APOINMENT_ID)).map(item => {
                                const info = getStatusInfo(item.ESTATUS);
                                const Icon = info.icon;
                                return <div key={item.APOINMENT_ID} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-slate-800">{ConvertDateTime(item.APPOINTMENT_DATE, item.APPOINTMENT_TIME, 0)}</p><p className="mt-1 text-xs text-slate-500">{ConvertDateTime(item.APPOINTMENT_DATE, item.APPOINTMENT_TIME, 1)} · {item.MESSAGE || 'Sin motivo registrado'}</p></div><span className={`inline-flex items-center gap-1 text-xs font-semibold ${info.color}`}><Icon className="h-4 w-4" /> {info.label}</span></div>;
                            })}</div>}
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-base font-bold">Información del cliente</h2>
                            <div className="flex items-center gap-4">
                                <img className="h-16 w-16 shrink-0 rounded-full border border-slate-100 bg-slate-100 object-cover" src={photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : User} alt="Foto del cliente" />
                                <div className="min-w-0"><p className="break-words font-bold">{customerName}</p><p className="mt-1 text-xs text-slate-500">{anonymous ? 'Cliente sin registro' : 'Cliente registrado'}</p></div>
                            </div>
                            {contact && <div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-2 text-xs font-semibold text-slate-400">Contacto</p><p className="break-all text-sm text-slate-700">{contact}</p>
                                {hasPhone ? <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"><PhoneIcon className="h-4 w-4" /> Enviar WhatsApp ↗</a> : <a href={`mailto:${contact}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-600"><EnvelopeIcon className="h-4 w-4" /> Enviar correo</a>}
                            </div>}
                        </section>

                        {!isFinished && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-bold">Administrar cita</h2>
                            <p className="mt-1 text-sm text-slate-500">Modifica el horario o cancela la reservación.</p>
                            <button type="button" onClick={startReschedule} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"><PencilSquareIcon className="h-5 w-5" /> {bMostrarEditar ? 'Cerrar reagendado' : 'Reagendar cita'}</button>
                            <button type="button" onClick={() => setIsOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"><TrashIcon className="h-5 w-5" /> Cancelar cita</button>
                        </section>}
                        {loadingRe ? (
                            <div role="status" className="mt-5 flex flex-col items-center justify-center gap-3 rounded-xl bg-orange-50 px-4 py-8">
                                <div className="h-5 w-5 animate-spin rounded-full border-[5px] border-[#fc6500] border-t-[#2c2c2c]" />
                                <p className="text-sm font-medium text-slate-600">
                                    Consultando horarios disponibles...
                                </p>
                            </div>
                        ) : bMostrarEditar && !isFinished &&
                        <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-bold">Elegir nueva fecha y hora</h2>
                            <p className="mb-4 mt-1 text-xs text-slate-500">Selecciona una fecha y luego un horario disponible.</p>
                            {/* Selector de vistas */}
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
                                <button
                                    type="button"
                                    onClick={() => setViewCalendario(false)}
                                    className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-all ${!viewCalendario
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Próximas fechas
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewCalendario(true)}
                                    className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-all ${viewCalendario
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Calendario
                                </button>
                            </div>
                            {/* Próximas fechas */}
                            {!viewCalendario && (
                                <div className="grid grid-cols-3 gap-3">
                                    {citas
                                        .filter(h =>
                                            h.APPOINTMENT.some(a => a.STATUS === "free")
                                        )
                                        .slice(0, 5)
                                        .map((h, index) => {
                                            const disponibles = h.APPOINTMENT.filter(
                                                a => a.STATUS === "free"
                                            ).length;

                                            const [year, month, day] =
                                                h.APPOINTMENT_DATE.split("-").map(Number);

                                            const fecha = new Date(year, month - 1, day);

                                            const seleccionado =
                                                startDate &&
                                                startDate.toDateString() === fecha.toDateString();

                                            return (
                                                <button
                                                    type="button"
                                                    key={`${h.APPOINTMENT_DATE}-${index}`}
                                                    onClick={() => {
                                                        setStartDate(fecha);
                                                        setselectedTime("");
                                                        setselectedIndex(null);
                                                    }}
                                                    className={`flex flex-col items-center justify-center rounded-xl border-2 px-2 py-4 transition-all duration-200 
                                                                        ${seleccionado
                                                            ? "border-orange-500 bg-orange-50 shadow-sm"
                                                            : "border-gray-200 bg-white hover:border-orange-300"
                                                        }`}
                                                >
                                                    <span className="text-xs text-gray-500 capitalize">
                                                        {fecha.toLocaleDateString("es-MX", {
                                                            weekday: "short"
                                                        }).replace(".", "")}
                                                    </span>

                                                    <span className="text-2xl font-bold text-gray-800 my-1">
                                                        {day}
                                                    </span>

                                                    <span className="text-xs text-gray-500">
                                                        {fecha.toLocaleDateString("es-MX", {
                                                            month: "short"
                                                        }).replace(".", "")}
                                                    </span>

                                                    <span className={`mt-3 rounded-full px-2.5 py-1 text-xs font-semibold ${seleccionado
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-orange-100 text-orange-700"
                                                        }`}>
                                                        {disponibles} libres
                                                    </span>
                                                </button>
                                            );
                                        })}
                                </div>
                            )}
                            {/* Calendario completo */}
                            {viewCalendario && (
                                <div className="calendar-custom flex justify-center">
                                    <DatePicker
                                        className="text-gray-700"
                                        inline
                                        dateFormat="dd/MM/yyyy"
                                        excludeDates={_excludeDates}
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            setselectedTime("");
                                            setselectedIndex(undefined);
                                        }}
                                        minDate={initialDate}
                                        maxDate={lastDate}
                                        locale="es"
                                    />
                                </div>
                            )}

                            {/* Fecha seleccionada */}
                            {startDate && (
                                <div className="flex items-center gap-3 mt-5 bg-green-50 border border-green-100 rounded-xl p-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600 shrink-0" />

                                    <div className="flex-1 text-left">
                                        <p className="text-xs text-green-700">
                                            Fecha seleccionada
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 capitalize">
                                            {dateSpanish(startDate)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label="Limpiar fecha"
                                        onClick={() => {
                                            setStartDate(null);
                                            setselectedTime('');
                                            setselectedIndex(undefined);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <CloseIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {startDate && (
                                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                                    {citaDate[0]?.map(({ APPOINTMENT_TIME, STATUS }, idx) =>
                                        <button key={idx} type="button" disabled={STATUS !== 'free'}
                                            onClick={() => { setselectedTime(APPOINTMENT_TIME); setselectedIndex(idx); }}
                                            className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${selectedIndex === idx ? 'border-orange-500 bg-orange-50 text-orange-700' : STATUS !== 'free' ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400' : 'border-slate-200 bg-white hover:border-orange-400'}`}>{APPOINTMENT_TIME}</button>)}
                                </div>
                            )}

                            <button type="button" disabled={!bAcceder || !startDate || !selectedTime} onClick={validateReschedule} className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">{bAcceder ? 'Guardar nuevo horario' : 'Procesando...'}</button>
                        </section>
                        }
                    </aside>
                </div>
            </div>
            {/* Modal */}
            {isOpen ?
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                            >
                                <CloseIcon className="w-5 h-5 text-gray-900" />
                            </button>
                            <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                            <p className="text-center text-yellow-500 mb-1">¿Seguro que quieres cancelar esta cita?</p>
                            <div className='flex justify-end mt-2'>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpen(false); }}>Cancelar</button>
                                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                    _buildCancelar();
                                }}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </> : isOpenU ? <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                            <button
                                onClick={() => setIsOpenU(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                            >
                                <CloseIcon className="w-5 h-5 text-gray-900" />
                            </button>
                            <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                            <p className="text-center text-yellow-500 mb-1">¿Deseas guardar tu cita?</p>
                            <p className="text-center text-gray-500 mb-4">Motivo de la visita/Servicio</p>
                            <hr className="mb-4" />
                            <textarea type="text" className='w-full text-black border px-4 py-2 rounded-md' placeholder='Opcional' rows="4" cols="50" onChange={handleChangeMessage}></textarea>
                            <div className='flex justify-end mt-2'>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { getDaysInactive(); setIsOpenU(false); }}>Cancelar</button>
                                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                    _buildConfirm();
                                }}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </> : <></>
            }
        </div>
    );
}

export default UpdateAppoinBusiness;