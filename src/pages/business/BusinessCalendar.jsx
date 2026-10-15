import React, { useCallback, useEffect, useMemo, useState } from 'react';
// rrd imports
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { fetchData } from "../../Wrapper.js";
import Loaging from '../../components/Loading.jsx';

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MINUTE_HEIGHT = 1.15;
const MIN_SLOT_HEIGHT = 30;
const CANCELED_STATUS = -1;

import { Cog6ToothIcon, StarIcon as StarIcon_Outline } from '@heroicons/react/24/outline';
import { ShareIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { urlApi } from "../../styles/Constants.jsx";

function localISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseLocalISO(value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
}
function addDays(value, days) {
    const d = parseLocalISO(value);
    d.setDate(d.getDate() + days);
    return localISO(d);
}
function startOfWeek(value) {
    const d = parseLocalISO(value);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return localISO(d);
}
function minutes(time) {
    if (!time) return null;
    const [h, m] = String(time).split(':').map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}
function clock(total) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function dateLabel(value, options = {}) {
    return new Intl.DateTimeFormat('es-MX', options).format(parseLocalISO(value));
}
function appointmentName(appointment) {
    const raw = appointment.ANONIMO?.split(',')?.[0]?.trim();
    return raw || appointment.COMPLET_NAME?.trim() || 'Cliente';
}
function isCanceled(appointment) {
    return Number(appointment.ESTATUS) === CANCELED_STATUS;
}
function durationMinutes(schedule) {
    if (!schedule) return null;
    const description = String(schedule.intervaloDes || '').toLowerCase();
    const amount = Number(schedule.intervalo);
    if (description.includes('hora')) return Number.isFinite(amount) && amount > 0 ? amount * 60 : 60;
    if (description.includes('min')) return Number.isFinite(amount) && amount > 0 ? amount : null;
    // Sin unidad confirmada, no inferimos duración desde el campo intervalo.
    return null;
}
function workingSchedule(spaceData, date) {
    const day = WEEKDAYS[parseLocalISO(date).getDay()];
    return (spaceData.schedule || []).find(s => s.day_name === day) || null;
}
function scheduledRange(schedule) {
    if (!schedule || Number(schedule.value) !== 1) return null;
    const start = minutes(`${schedule.desdeH}:${schedule.desdeM}`);
    const end = minutes(`${schedule.hastaH}:${schedule.hastaM}`);
    return start != null && end != null && end > start ? { start, end } : null;
}
function flattenAppointments(data) {
    return (Array.isArray(data) ? data : []).flatMap(group =>
        (group.APPOINTMENT || []).map(appointment => ({ ...appointment, date: group.APPOINTMENT_DATE }))
    );
}
function availabilityForDate(data, date) {
    const group = (data.availability || []).find(row => row.APPOINTMENT_DATE === date);
    return group?.APPOINTMENT || [];
}
function excludedDateSet(values) {
    return new Set((values || []).map(value => {
        const [d, m, y] = String(value).split('/');
        return y && m && d ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : '';
    }));
}
function normalizeResponse(json, endpoint) {
    if (!json || (json.sucess !== true && json.success !== true) || !Array.isArray(json.data)) {
        throw new Error(`Respuesta inesperada de ${endpoint}`);
    }
    return json.data;
}
async function getJSON(url, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Error HTTP ${response.status}: ${url}`);
    return response.json();
}

async function getOptionalData(url, signal) {
    const response = await fetch(url, { signal });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
    }

    const json = await response.json();
    return normalizeResponse(json, url);
}

function apiUrl(base, path, params) {
    const prefix = base.endsWith('/') ? base : `${base}/`;
    const query = new URLSearchParams(params);
    return `${prefix}${path}?${query.toString()}`;
}
function displayStatus(status) {
    const code = Number(status);
    return ({ [-1]: 'Cancelada', 0: 'Nueva', 1: 'Modificada', 2: 'Finalizada', 3: 'Actual' })[code] || `Estado ${status}`;
}
async function getScheduleWithFallback(
    urlApi,
    businessId,
    spaceId,
    signal
) {
    const consultar = async (params) => {
        const response = await fetch(
            apiUrl(urlApi, 'schedule', params),
            { signal }
        );

        if (response.status === 404) return null;

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status} en schedule`);
        }

        return normalizeResponse(
            await response.json(),
            'schedule'
        );
    };

    const horarioEspacio = await consultar({
        bussinessId: businessId,
        busSpacesId: spaceId
    });

    if (horarioEspacio?.length) {
        return horarioEspacio;
    }

    return (
        await consultar({ bussinessId: businessId })
    ) || [];
}

export default function BusinessCalendar() {
    const navigate = useNavigate();
    const stored = JSON.parse(localStorage.getItem("homeBusiness"));
    const businessId = stored.businessId ?? '';
    const businessAdmin = stored.tipo;
    const [empresa, SetEmpresa] = useState([]);
    const [date, setDate] = useState(() => localISO(new Date()));
    const [view, setView] = useState('day');
    const [selectedSpace, setSelectedSpace] = useState('all');
    const [spaces, setSpaces] = useState([]);
    const [spaceData, setSpaceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCanceled, setShowCanceled] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);
    const [newAppointment, setNewAppointment] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerComment, setCustomerComment] = useState('');
    const [savingAppointment, setSavingAppointment] = useState(false);
    const [customerMode, setCustomerMode] = useState('registered');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [registeredSearch, setRegisteredSearch] = useState('');
    const [selectedRegisteredUser, setSelectedRegisteredUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [savingFavoriteId, setSavingFavoriteId] = useState(null);



    const filteredRegisteredUsers = useMemo(() => {
        const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const term = normalized(registeredSearch.trim());
        const list = term
            ? registeredUsers.filter(user => normalized(`${user.first_name || ''} ${user.last_name || ''}`).includes(term) || normalized(user.email).includes(term))
            : registeredUsers.filter(user => Number(user.FAVORITE) === 1);
        return list.slice(0, 40);
    }, [registeredUsers, registeredSearch]);

    useEffect(() => {
        if (!newAppointment || customerMode !== 'registered') return;
        const storedUser = fetchData('UserCitaFix');
        const userId = storedUser?.USER_ID;
        if (!userId) {
            setUsersError('No se encontró el usuario de sesión para consultar clientes.');
            return;
        }
        const controller = new AbortController();
        async function loadUsers() {
            setUsersLoading(true);
            setUsersError('');
            try {
                const response = await fetch(apiUrl(urlApi, 'users', { user_id: userId }), { signal: controller.signal });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                setRegisteredUsers(normalizeResponse(json, 'users'));
            } catch (err) {
                if (!controller.signal.aborted) setUsersError('No se pudieron cargar los clientes. ' + err.message);
            } finally {
                if (!controller.signal.aborted) setUsersLoading(false);
            }
        }
        loadUsers();
        return () => controller.abort();
    }, [newAppointment, customerMode]);

    function onNewAppointment({ space, date, time }) {
        setCustomerName('');
        setCustomerPhone('');
        setCustomerComment('');
        setCustomerMode('registered');
        setRegisteredSearch('');
        setSelectedRegisteredUser(null);
        setNewAppointment({ space, date, time });
    }

    async function saveNewAppointment(event) {
        event.preventDefault();
        if (!newAppointment || savingAppointment) return;
        const isRegistered = customerMode === 'registered';
        const nombre = customerName.trim();
        const digits = customerPhone.replace(/\D/g, '');
        if (isRegistered && !selectedRegisteredUser) { toast.error('Selecciona un cliente registrado.'); return; }
        if (!isRegistered && !nombre) { toast.error('Ingresa el nombre del cliente.'); return; }
        if (!isRegistered && digits.length !== 10) { toast.error('Ingresa un teléfono de 10 dígitos.'); return; }

        const { space, date, time } = newAppointment;
        const data = spaceData[String(space.BUS_SPACES_ID)];
        const available = availabilityForDate(data || {}, date).some(slot =>
            slot.APPOINTMENT_TIME?.slice(0, 5) === time.slice(0, 5) && slot.STATUS === 'free'
        );
        if (!available || data?.excluded?.has(date) || !scheduledRange(workingSchedule(data, date))) {
            toast.error('El horario ya no figura como disponible. Actualiza la agenda.');
            return;
        }

        setSavingAppointment(true);
        try {
            const payload = {
                user_id: isRegistered ? selectedRegisteredUser.USER_ID : '0',
                bussiness_id: businessId,
                usernotification_id: isRegistered ? selectedRegisteredUser.USER_ID : '0',
                appointment_date: date,
                appointment_time: time,
                anonimo: isRegistered ? '' : `${nombre},+52 ${digits}`,
                message: customerComment.trim(),
                estatus: '0',
                dorsl: empresa?.DORSL || '',
                for_who: isRegistered ? 'Usr' : 'Bus',
                bus_spaces_id: space.BUS_SPACES_ID,
                name_space: space.ALIAS || space.NAME_SPACE || ''
            };
            const response = await fetch(`${urlApi.endsWith('/') ? urlApi : urlApi + '/'}${isRegistered ? 'appoin' : 'appoinW'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok || result.sucess !== true) {
                throw new Error(result.message || 'El horario ya no está disponible o no se pudo guardar la cita.');
            }
            toast.success('Cita registrada correctamente.');
            setNewAppointment(null);
            setRefreshIndex(index => index + 1);
        } catch (err) {
            toast.error(err.message || 'Error al registrar la cita.');
        } finally {
            setSavingAppointment(false);
        }
    }

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const buildFavorite = async (user) => {
        if (savingFavoriteId !== null) return;

        const isFavorite = Number(user.FAVORITE) === 1;
        const newFavorite = isFavorite ? 0 : 1;

        setSavingFavoriteId(user.USER_ID);

        try {
            const response = await fetch(`${urlApi}userFavorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    favorites_id: user.FAVORITES_ID ?? null,
                    bussiness_id: businessId,
                    user_id: user.USER_ID,
                    is_active: String(newFavorite)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();

            if (json.sucess !== true && json.success !== true) {
                throw new Error('No fue posible actualizar el favorito.');
            }

            // Actualizar la lista de usuarios sin consultar nuevamente
            setRegisteredUsers(prev =>
                prev.map(item =>
                    item.USER_ID === user.USER_ID
                        ? {
                            ...item,
                            FAVORITE: newFavorite,
                            FAVORITES_ID:
                                json.data?.FAVORITES_ID ??
                                item.FAVORITES_ID
                        }
                        : item
                )
            );

            toast.success(
                newFavorite === 1
                    ? `${user.first_name} ${user.last_name} agregado a favoritos.`
                    : `${user.first_name} ${user.last_name} eliminado de favoritos.`
            );

        } catch (error) {
            console.error(error);
            toast.error('No fue posible actualizar el favorito.');
        } finally {
            setSavingFavoriteId(null);
        }
    };


    useEffect(() => {
        if (!businessId || !urlApi) {
            setError('Faltan las propiedades businessId o urlApi.');
            setLoading(false);
            return;
        }
        const controller = new AbortController();
        const { signal } = controller;
        async function load() {
            setLoading(true);
            setError('');
            try {
                const spacesResult = await getJSON(apiUrl(urlApi, 'spaceBusinessId', { bussiness_id: businessId }), signal);
                const activeSpaces = normalizeResponse(spacesResult, 'spaceBusinessId').filter(s => Number(s.IS_ACTIVE) === 1);
                const results = await Promise.allSettled(activeSpaces.map(async space => {
                    const params = { bussiness_id: businessId, busSpacesId: space.BUS_SPACES_ID };

                    const [schedule, availability, excluded, appointments] =
                        await Promise.all([
                            getScheduleWithFallback(
                                urlApi,
                                businessId,
                                space.BUS_SPACES_ID,
                                signal
                            ),

                            getOptionalData(
                                apiUrl(urlApi, 'appoinBussDate', params),
                                signal
                            ),

                            getOptionalData(
                                apiUrl(urlApi, 'appoinBussDateDays', params),
                                signal
                            ),

                            getOptionalData(
                                apiUrl(urlApi, 'appoinBussiness', params),
                                signal
                            )
                        ]);

                    return [
                        String(space.BUS_SPACES_ID),
                        {
                            schedule,
                            availability,
                            excluded: excludedDateSet(excluded),
                            appointments: flattenAppointments(appointments)
                        }
                    ];
                }));
                if (signal.aborted) return;
                const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
                setSpaces(activeSpaces);
                setSpaceData(Object.fromEntries(successful));
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(
                            `Error cargando espacio ${activeSpaces[index].BUS_SPACES_ID}:`,
                            result.reason
                        );
                    }
                });
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    SetEmpresa(json['data']);
                }
            } catch (e) {
                if (!signal.aborted) setError(e.message || 'No fue posible cargar la agenda.');
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [businessId, urlApi, refreshIndex]);

    const visibleSpaces = useMemo(() => spaces.filter(s => selectedSpace === 'all' || String(s.BUS_SPACES_ID) === selectedSpace), [spaces, selectedSpace]);
    const weekStart = startOfWeek(date);
    const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
    const currentDates = view === 'day' ? [date] : weekDates;

    const [mobileSpaceId, setMobileSpaceId] = useState('');

    const mobileSpaces = visibleSpaces.filter(
        space => String(space.BUS_SPACES_ID) === (
            selectedSpace !== 'all'
                ? selectedSpace
                : mobileSpaceId || String(visibleSpaces[0]?.BUS_SPACES_ID)
        )
    );

    const timeline = useMemo(() => {
        let min = Infinity;
        let max = -Infinity;
        for (const space of visibleSpaces) {
            const data = spaceData[String(space.BUS_SPACES_ID)];
            if (!data) continue;
            for (const day of currentDates) {
                const range = scheduledRange(workingSchedule(data, day));
                if (range) { min = Math.min(min, range.start); max = Math.max(max, range.end); }
                for (const slot of availabilityForDate(data, day)) {
                    const time = minutes(slot.APPOINTMENT_TIME);
                    if (time != null) { min = Math.min(min, time); max = Math.max(max, time + 60); }
                }
                for (const appt of data.appointments.filter(a => a.date === day)) {
                    const time = minutes(appt.APPOINTMENT_TIME);
                    if (time != null) { min = Math.min(min, time); max = Math.max(max, time + 60); }
                }
            }
        }
        if (!Number.isFinite(min)) return { start: 8 * 60, end: 18 * 60 };
        return { start: Math.floor(min / 60) * 60, end: Math.ceil(max / 60) * 60 };
    }, [visibleSpaces, spaceData, currentDates.join('|')]);

    const height = (timeline.end - timeline.start) * MINUTE_HEIGHT;
    const ticks = Array.from({ length: Math.floor((timeline.end - timeline.start) / 60) + 1 }, (_, i) => timeline.start + i * 60);

    const getAppointments = useCallback((spaceId, day) => {
        return (spaceData[String(spaceId)]?.appointments || []).filter(a => a.date === day && (showCanceled || !isCanceled(a)));
    }, [spaceData, showCanceled]);

    function changePeriod(direction) { setDate(previous => addDays(previous, direction * (view === 'day' ? 1 : 7))); }

    function DayColumn({ space, day }) {
        const data = spaceData[String(space.BUS_SPACES_ID)];
        if (!data) return <div className="h-full rounded-lg bg-slate-100 p-3 text-xs text-slate-500">No se pudieron cargar los datos.</div>;
        const schedule = workingSchedule(data, day);
        const range = scheduledRange(schedule);
        const excluded = data.excluded.has(day);
        const noTrabaja = !range || excluded;
        const slots = availabilityForDate(data, day);
        const appts = getAppointments(space.BUS_SPACES_ID, day);
        const duration = durationMinutes(schedule);
        const activeByTime = new Map(
            appts
                .filter(a => !isCanceled(a))
                .map(a => [minutes(a.APPOINTMENT_TIME), a])
        );

        const slotTimes = new Set(
            slots.map(s => minutes(s.APPOINTMENT_TIME))
        );

        // Citas activas fuera de los horarios definidos
        const unlistedAppointments = appts.filter(
            a => !isCanceled(a) && !slotTimes.has(minutes(a.APPOINTMENT_TIME))
        );

        // Citas canceladas, independientemente de si el horario existe
        const canceledAppointments = appts.filter(a => isCanceled(a));

        return (
            <div className="relative border-l border-slate-200 bg-white" style={{ height }}>
                {ticks.map(t => <div key={t} className="pointer-events-none absolute left-0 right-0 border-t border-slate-100" style={{ top: (t - timeline.start) * MINUTE_HEIGHT }} />)}
                {(!range || excluded) && <div className="pointer-events-none absolute inset-0 bg-slate-100/70" />}
                {range && <>
                    <div className="pointer-events-none absolute left-0 right-0 bg-slate-100/60" style={{ top: 0, height: Math.max(0, (range.start - timeline.start) * MINUTE_HEIGHT) }} />
                    <div className="pointer-events-none absolute left-0 right-0 bg-slate-100/60" style={{ top: Math.max(0, (range.end - timeline.start) * MINUTE_HEIGHT), bottom: 0 }} />
                </>}
                {slots.map((slot, index) => {
                    const time = minutes(slot.APPOINTMENT_TIME);
                    if (time == null) return null;
                    const next = minutes(slots[index + 1]?.APPOINTMENT_TIME);
                    const estimated = duration || (next != null && next > time ? next - time : 60);
                    const slotHeight = Math.max(MIN_SLOT_HEIGHT, estimated * MINUTE_HEIGHT - 3);
                    const appointment = activeByTime.get(time);
                    const isFinished = Number(appointment?.ESTATUS) === 2;
                    const free = slot.STATUS === 'free' && !excluded && Boolean(range) && time >= range.start && time < range.end && !appointment;
                    const canCreate = free && typeof onNewAppointment === 'function';
                    return (
                        <button
                            key={`${slot.APPOINTMENT_TIME}-${index}`}
                            type="button"
                            disabled={!canCreate && !appointment}
                            onClick={() => appointment ? setSelectedAppointment({ appointment, space, date: day }) : onNewAppointment?.({ space, date: day, time: slot.APPOINTMENT_TIME })}
                            title={appointment ? `Ver cita de ${appointmentName(appointment)}` : free ? `Horario libre ${slot.APPOINTMENT_TIME}` : 'No disponible'}
                            className={`absolute left-1 right-1 overflow-hidden rounded-md border px-2 py-1 text-left text-xs transition ${appointment ? isFinished ? 'z-20 border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200' : 'z-20 border-blue-300 bg-blue-100 text-blue-900 hover:bg-blue-200' : free ? 'z-10 border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-slate-200 bg-slate-100 text-slate-400'} ${canCreate ? 'cursor-pointer' : ''}`}
                            style={{ top: (time - timeline.start) * MINUTE_HEIGHT + 2, height: slotHeight }}
                        >
                            <span className="block font-semibold">{clock(time)}</span>
                            <span className="block truncate">{appointment ? appointmentName(appointment) : free ? '+ Disponible' : 'No disponible'}</span>
                            {isFinished && (
                                <span className="mt-1 inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                    ✓ Finalizada
                                </span>
                            )}
                        </button>
                    );
                })}
                {showCanceled && canceledAppointments.map((appointment, index) => {
                    const time = minutes(appointment.APPOINTMENT_TIME);

                    if (time == null) return null;

                    const hasActiveAppointment = activeByTime.has(time);

                    return (
                        <button
                            key={`canceled-${appointment.APOINMENT_ID}-${index}`}
                            type="button"
                            onClick={() => {
                                setSelectedAppointment({
                                    appointment,
                                    space,
                                    date: day
                                });
                            }}
                            title={`Cita cancelada: ${appointmentName(appointment)}`}
                            className={`absolute right-2 z-30 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 
                                text-left text-[11px] text-slate-500 shadow-sm transition hover:bg-slate-100 ${hasActiveAppointment ? 'left-[45%]' : 'left-2'} `}
                            style={{
                                top: (time - timeline.start) * MINUTE_HEIGHT + 3,
                                maxHeight: 44
                            }}
                        >
                            <span className="block truncate font-medium line-through">
                                {appointmentName(appointment)}
                            </span>

                            <span className="block text-[10px] font-semibold text-slate-500">
                                Cancelada
                            </span>
                        </button>
                    );
                })}
                {excluded && <div className="pointer-events-none absolute inset-x-1 top-1 z-30 rounded bg-slate-700/90 px-2 py-1 text-center text-xs text-white">Día excluido para reservas</div>}
                {noTrabaja && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-lg bg-slate-200 px-4 py-3 text-center">
                            <p className="text-sm font-semibold text-slate-600">
                                No disponible
                            </p>
                            <p className="text-xs text-slate-500">
                                Este espacio no trabaja hoy
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const allWeekAppointments = weekDates.flatMap(day => visibleSpaces.flatMap(space => getAppointments(space.BUS_SPACES_ID, day).map(appointment => ({ appointment, space, day }))));

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-800">
            <div className="mx-auto mt-14 w-full max-w-8xl space-y-6 px-3 py-6 text-gray-800 sm:px-6">
                <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm md:p-6">
                    <div className="cursor-pointer flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800">{empresa.DORSL}</h2>
                        </div>
                        <div className='flex items-center justify-between ml-2 '>
                            {businessAdmin && <button className='mr-2' onClick={() =>
                                navigate("/viewUpdateBusiness", { state: { businessId: businessId, tipo: businessAdmin } })} >
                                <Cog6ToothIcon width={24} />
                            </button>}
                            <button onClick={() => {
                                const baseUrl = '/viewBusiness';
                                const params = new URLSearchParams({
                                    n: empresa.DORSL,
                                    i: businessId
                                });
                                navigate(`${baseUrl}?${params.toString()}`);
                            }
                            } >
                                <ShareIcon width={24} />
                            </button>
                        </div>
                    </div>
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">

                        <div><h2 className="text-xl font-bold">Agenda de reservaciones</h2><p className="mt-1 text-sm text-slate-500">Todos tus espacios en un solo calendario</p></div>

                        <button type="button" onClick={() => setRefreshIndex(x => x + 1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">↻ Actualizar</button>
                    </div>
                    <div className="mb-4 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:gap-3">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                            {/* Navegación */}
                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() => changePeriod(-1)}
                                    aria-label="Anterior"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDate(localISO(new Date()))}
                                    className="h-10 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
                                >
                                    Hoy
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changePeriod(1)}
                                    aria-label="Siguiente"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </button>

                            </div>

                            {/* Fecha */}
                            <strong className="block text-sm font-bold capitalize text-slate-800 sm:ml-2">
                                {view === 'day'
                                    ? dateLabel(date, {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                    : `${dateLabel(weekStart, {
                                        day: 'numeric',
                                        month: 'short'
                                    })} – ${dateLabel(addDays(weekStart, 6), {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}`}
                            </strong>

                        </div>

                        {/* Vista */}
                        <div className="flex w-fit rounded-lg border border-slate-200 p-1">
                            {[
                                ['day', 'Día'],
                                ['week', 'Semana']
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setView(value)}
                                    className={`rounded-md px-4 py-2 text-sm ${view === value
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                    </div>
                    {/* Selector de espacios exclusivo para móvil */}
                    {view === 'day' && visibleSpaces.length > 0 && (
                        <div className="mb-4 sm:hidden">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Selecciona un espacio
                            </label>

                            <select
                                value={mobileSpaces[0]?.BUS_SPACES_ID ?? ''}
                                onChange={e => setMobileSpaceId(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                            >
                                {visibleSpaces.map(space => (
                                    <option
                                        key={space.BUS_SPACES_ID}
                                        value={String(space.BUS_SPACES_ID)}
                                    >
                                        {space.ALIAS || space.NAME_SPACE}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/* Selector de espacios exclusivo para escritorio */}
                    <div className="mb-4 hidden flex-wrap items-center gap-4 sm:flex">
                        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700 sm:w-auto sm:flex-row sm:items-center">

                            <span>Espacio</span>

                            <select
                                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 sm:w-auto sm:max-w-[250px]"
                                value={selectedSpace}
                                onChange={e => setSelectedSpace(e.target.value)}
                            >
                                <option value="all">Todos los espacios</option>

                                {spaces.map(space => (
                                    <option
                                        key={space.BUS_SPACES_ID}
                                        value={String(space.BUS_SPACES_ID)}
                                    >
                                        {space.ALIAS || space.NAME_SPACE}
                                    </option>
                                ))}
                            </select>

                        </label>
                        
                    </div>
                    <div className="mb-4 flex flex-wrap items-center gap-3">

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={showCanceled}
                                onChange={e => setShowCanceled(e.target.checked)}
                            />
                            Mostrar canceladas
                        </label>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>🟩 Disponible</span>
                            <span>🟦 Cita</span>
                            <span>⬜ No disponible</span>
                        </div>

                    </div>
                    {error && <div role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</div>}
                    {loading ? <div className="py-16 text-center text-slate-500">Cargando espacios y reservaciones…</div> : spaces.length === 0 ?
                        <div className="py-12 text-center text-slate-500">No hay espacios activos para mostrar.</div> : view === 'day' ? (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <div className="block sm:hidden">
                                    {/* Calendario móvil */}
                                    <div className="block sm:hidden">
                                        <div className="w-full min-w-0">

                                            {/* Encabezado */}
                                            <div
                                                className="grid border-b border-slate-200 bg-slate-50"
                                                style={{
                                                    gridTemplateColumns: '55px minmax(0, 1fr)'
                                                }}
                                            >
                                                <div className="p-2 text-xs text-slate-500">
                                                    Hora
                                                </div>

                                                {mobileSpaces.map(space => (
                                                    <div
                                                        key={space.BUS_SPACES_ID}
                                                        className="min-w-0 border-l border-slate-200 p-2"
                                                    >
                                                        <div className="break-words text-sm font-semibold">
                                                            {space.ALIAS || space.NAME_SPACE}
                                                        </div>

                                                        <div className="truncate text-xs text-slate-500">
                                                            {space.NAME_SPACE}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Horarios y citas */}
                                            <div
                                                className="grid"
                                                style={{
                                                    gridTemplateColumns: '55px minmax(0, 1fr)'
                                                }}
                                            >
                                                <div className="relative" style={{ height }}>
                                                    {ticks.map(t => (
                                                        <span
                                                            key={t}
                                                            className="absolute left-1 -translate-y-1/2 text-[10px] text-slate-500"
                                                            style={{
                                                                top: (t - timeline.start) * MINUTE_HEIGHT
                                                            }}
                                                        >
                                                            {clock(t)}
                                                        </span>
                                                    ))}
                                                </div>

                                                {mobileSpaces.map(space => (
                                                    <DayColumn
                                                        key={space.BUS_SPACES_ID}
                                                        space={space}
                                                        day={date}
                                                    />
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    {/* Calendario escritorio: usar visibleSpaces */}
                                    <div style={{ minWidth: Math.max(480, 75 + visibleSpaces.length * 190) }}>
                                        <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `75px repeat(${visibleSpaces.length}, minmax(190px, 1fr))` }}>
                                            <div className="p-3 text-xs text-slate-500">Hora</div>
                                            {visibleSpaces.map(space => <div key={space.BUS_SPACES_ID} className="border-l border-slate-200 p-3"><div className="text-sm font-semibold">{space.ALIAS || space.NAME_SPACE}</div><div className="text-xs text-slate-500">{space.NAME_SPACE}</div></div>)}
                                        </div>
                                        <div className="grid" style={{ gridTemplateColumns: `75px repeat(${visibleSpaces.length}, minmax(190px, 1fr))` }}>
                                            <div className="relative" style={{ height }}>{ticks.map(t => <span key={t} className="absolute left-2 -translate-y-1/2 text-xs text-slate-500" style={{ top: (t - timeline.start) * MINUTE_HEIGHT }}>{clock(t)}</span>)}</div>
                                            {visibleSpaces.map(space => <DayColumn key={space.BUS_SPACES_ID} space={space} day={date} />)}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <div className="grid min-w-[840px] grid-cols-7 divide-x divide-slate-200">
                                    {weekDates.map(day => <div key={day} className="min-w-0">
                                        <button type="button" onClick={() => { setDate(day); setView('day'); }} className={`w-full border-b p-3 text-left hover:bg-blue-50 ${day === localISO(new Date()) ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                            <span className="block text-xs text-slate-500">{WEEKDAY_SHORT[parseLocalISO(day).getDay()]}</span><span className="text-lg font-semibold">{parseLocalISO(day).getDate()}</span>
                                        </button>
                                        <div className="min-h-[240px] space-y-2 p-2">
                                            {visibleSpaces.map(space => {
                                                const data = spaceData[String(space.BUS_SPACES_ID)];
                                                if (!data) return null;
                                                const appts = getAppointments(space.BUS_SPACES_ID, day).sort((a, b) => (minutes(a.APPOINTMENT_TIME) || 0) - (minutes(b.APPOINTMENT_TIME) || 0));
                                                return <React.Fragment key={space.BUS_SPACES_ID}>
                                                    {appts.map(a => <button key={a.APOINMENT_ID} type="button" onClick={() => { setSelectedAppointment({ appointment: a, space, date: day }); }} className={`w-full rounded-md border p-2 text-left text-xs ${isCanceled(a) ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-blue-200 bg-blue-50 text-blue-900'}`}>
                                                        <span className="block font-bold">{String(a.APPOINTMENT_TIME).slice(0, 5)}</span><span className="block truncate">{appointmentName(a)}</span>{selectedSpace === 'all' && <span className="block truncate text-[10px] opacity-70">{space.ALIAS}</span>}
                                                    </button>)}
                                                </React.Fragment>;
                                            })}
                                            {visibleSpaces.every(space => getAppointments(space.BUS_SPACES_ID, day).length === 0) && <div className="py-3 text-center text-xs text-slate-400">Sin citas</div>}
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        )}
                    {newAppointment && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !savingAppointment) setNewAppointment(null); }}>
                            <div role="dialog" aria-modal="true" aria-labelledby="new-appointment-title" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <h3 id="new-appointment-title" className="text-xl font-bold text-slate-900">Nueva cita</h3>
                                        <p className="mt-1 text-sm text-slate-500">{newAppointment.space.ALIAS || newAppointment.space.NAME_SPACE}</p>
                                        <p className="text-sm font-semibold text-orange-600">{dateLabel(newAppointment.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {newAppointment.time}</p>
                                    </div>
                                    <button type="button" aria-label="Cerrar" disabled={savingAppointment} onClick={() => setNewAppointment(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">✕</button>
                                </div>
                                <form onSubmit={saveNewAppointment} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                                        <button type="button" disabled={savingAppointment} onClick={() => setCustomerMode('registered')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${customerMode === 'registered' ? 'bg-white text-orange-600 shadow' : 'text-slate-600'}`}>Registrado</button>
                                        <button type="button" disabled={savingAppointment} onClick={() => setCustomerMode('anonymous')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${customerMode === 'anonymous' ? 'bg-white text-orange-600 shadow' : 'text-slate-600'}`}>Sin registro</button>
                                    </div>
                                    {customerMode === 'registered' ? (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-slate-700">Buscar por nombre o correo
                                                <input value={registeredSearch} onChange={e => { setRegisteredSearch(e.target.value); setSelectedRegisteredUser(null); }} placeholder="Buscar cliente..." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
                                            </label>
                                            <p className="text-xs font-semibold text-slate-500">{registeredSearch.trim() ? 'Resultados' : '★ Clientes favoritos'}</p>
                                            <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                                                {usersLoading ?
                                                    <p className="p-2 text-sm text-slate-500">Cargando clientes…</p> : usersError ? <p className="p-2 text-sm text-red-600">{usersError}</p> : filteredRegisteredUsers.length === 0 ?
                                                        <p className="p-2 text-sm text-slate-500">{registeredSearch.trim() ? 'No se encontraron clientes.' : 'Sin favoritos. Escribe para buscar clientes.'}</p> :
                                                        filteredRegisteredUsers.map(user => (
                                                            <button key={user.USER_ID} type="button" onClick={() => setSelectedRegisteredUser(user)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selectedRegisteredUser?.USER_ID === user.USER_ID ? 'border border-orange-400 bg-orange-50' : 'hover:bg-slate-100'}`}>
                                                                <div className="flex items-center space-x-4 mr-20" >
                                                                    {
                                                                        user.PHOTO == null ? (
                                                                            <UserCircleIcon
                                                                                className="w-10 h-10 shrink-0 text-orange-500"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={'data:image/jpeg;base64,' + arrayBufferToBase64(user.PHOTO.data)}
                                                                                alt={`${user.first_name} ${user.last_name}`}
                                                                                className="w-10 h-10 shrink-0 rounded-full object-cover"
                                                                            />
                                                                        )
                                                                    }
                                                                    <div>
                                                                        <span className="min-w-0"><span className="block truncate font-semibold">{user.first_name} {user.last_name} </span>
                                                                            <span className="block truncate text-xs text-slate-500">{user.email}</span></span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        buildFavorite(user);
                                                                    }}
                                                                    disabled={savingFavoriteId !== null}
                                                                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-orange-50"
                                                                >
                                                                    {savingFavoriteId === user.USER_ID ? (
                                                                        <div className="h-5 w-5 animate-spin rounded-full border-[5px] border-[#fc6500] border-t-[#2c2c2c]" />
                                                                    ) : Number(user.FAVORITE) === 1 ? (
                                                                        <StarIcon className="w-6 h-6 text-orange-500" />
                                                                    ) : (
                                                                        <StarIcon_Outline className="w-6 h-6 text-orange-500" />
                                                                    )}
                                                                </button>
                                                                {selectedRegisteredUser?.USER_ID === user.USER_ID && <span className="ml-2 text-orange-600">✓</span>}
                                                            </button>
                                                        ))}
                                            </div>
                                            {selectedRegisteredUser && <p className="text-sm text-emerald-700">Cliente seleccionado: {selectedRegisteredUser.first_name} {selectedRegisteredUser.last_name}</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-slate-700">Nombre del cliente *
                                                <input required maxLength={120} value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nombre completo" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
                                            </label>
                                            <label className="block text-sm font-medium text-slate-700">Teléfono (10 dígitos) *
                                                <input required type="tel" inputMode="numeric" autoComplete="tel-national" value={customerPhone} onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="8711234567"
                                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
                                            </label>
                                        </div>
                                    )}
                                    <label className="block text-sm font-medium text-slate-700">Comentario (opcional)
                                        <textarea rows={3} maxLength={500} value={customerComment} onChange={e => setCustomerComment(e.target.value)} placeholder="Motivo de la visita o servicio" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
                                    </label>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button type="button" disabled={savingAppointment} onClick={() => setNewAppointment(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Cancelar</button>
                                        <button type="submit" disabled={savingAppointment} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">{savingAppointment ? 'Guardando…' : 'Guardar cita'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {selectedAppointment && (
                        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">

                            <div className="flex items-start justify-between gap-3">
                                <strong>Detalle de la cita</strong>

                                <button
                                    type="button"
                                    onClick={() => setSelectedAppointment(null)}
                                    aria-label="Cerrar detalle"
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mt-2 space-y-1">
                                <p>
                                    <strong>Cliente:</strong>{' '}
                                    {appointmentName(selectedAppointment.appointment)}
                                </p>

                                <p>
                                    <strong>Espacio:</strong>{' '}
                                    {selectedAppointment.space.ALIAS}
                                </p>

                                <p>
                                    <strong>Fecha:</strong>{' '}
                                    {selectedAppointment.date} ·{' '}
                                    {String(selectedAppointment.appointment.APPOINTMENT_TIME).slice(0, 5)}
                                </p>

                                <p>
                                    <strong>Estado:</strong>{' '}
                                    {displayStatus(selectedAppointment.appointment.ESTATUS)}
                                </p>

                                {selectedAppointment.appointment.MESSAGE && (
                                    <p>
                                        <strong>Mensaje:</strong>{' '}
                                        {selectedAppointment.appointment.MESSAGE}
                                    </p>
                                )}
                            </div>

                            {/* Botón para administrar la cita */}
                            <div className="mt-4 flex justify-end border-t border-blue-200 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`/updateAppoinBusiness/${selectedAppointment.appointment['APOINMENT_ID']}`);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600"
                                >
                                    Ver más detalles
                                    <span aria-hidden="true">→</span>
                                </button>
                            </div>

                        </div>
                    )}
                    <p className="mt-3 text-xs text-slate-500">La vista semanal muestra citas registradas; selecciona un día para ver la disponibilidad por espacio.</p>
                </section>
            </div>
        </div>
    );
}
