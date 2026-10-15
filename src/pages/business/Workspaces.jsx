import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    BuildingOffice2Icon,
    UsersIcon,
    ArrowRightIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

import { urlApi } from '../../styles/Constants.jsx';
import { fetchData } from '../../Wrapper.js';

export default function Workspaces() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [empresa, setEmpresa] = useState(null);
    const [colaboraciones, setColaboraciones] = useState([]);
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [processingInvitation, setProcessingInvitation] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [userId, setUserId] = useState(null);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const responderInvitacion = async (accion) => {
        if (!selectedInvitation || processingInvitation) return;

        const aceptar = accion === 'aceptar';

        setProcessingInvitation(true);

        try {
            const endpoint = aceptar
                ? 'collaboratorConfirm'
                : 'collaboratorRechazar';

            const response = await fetch(`${urlApi}${endpoint}`, {
                method: aceptar ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collaborator_id: String(selectedInvitation.ID),
                    name: firstName
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();

            if (json.sucess !== true && json.success !== true) {
                throw new Error('No fue posible responder la invitación.');
            }

            // Actualizar colaboraciones desde la API
            const responseCol = await fetch(
                `${urlApi}usrInfCol?user_id=${userId}`
            );

            if (!responseCol.ok && responseCol.status !== 404) {
                throw new Error('No fue posible actualizar las colaboraciones.');
            }

            if (responseCol.status === 404) {
                setColaboraciones([]);
            } else {
                const jsonCol = await responseCol.json();

                setColaboraciones(
                    Array.isArray(jsonCol.data) ? jsonCol.data : []
                );
            }

            toast.success(
                aceptar
                    ? '¡Invitación aceptada correctamente!'
                    : 'Invitación rechazada.'
            );

            setSelectedInvitation(null);

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Ocurrió un error.');

        } finally {
            setProcessingInvitation(false);
        }
    };

    useEffect(() => {
        if (sCorreo == null && sPassword == null) {
            navigate("/");
        }

        const controller = new AbortController();

        const cargarEmpresas = async () => {

            setLoading(true);
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-citafix-ps': sPassword
                },
                signal: controller.signal
            };

            try {

                const sCorreo = fetchData('correo');

                if (!sCorreo) {
                    throw new Error('No se encontró el correo del usuario.');
                }

                // 1. Obtener usuario y empresa propia
                const response = await fetch(
                    `${urlApi}usr?email=${encodeURIComponent(sCorreo)}`,
                    options
                );

                if (!response.ok) {
                    throw new Error('No se pudo obtener el usuario.');
                }

                const json = await response.json();
                const usuario = json.data;

                if (!usuario?.USER_ID) {
                    throw new Error('El usuario no tiene un identificador válido.');
                }

                localStorage.setItem(
                    'UserCitaFix',
                    JSON.stringify(usuario)
                );

                if (usuario.BUSSINESS_ID) {
                    setEmpresa(usuario);
                }

                setFirstName(usuario.first_name || '');
                setUserId(usuario.USER_ID);

                // 2. Obtener empresas donde colabora
                const responseCol = await fetch(
                    `${urlApi}usrInfCol?user_id=${usuario.USER_ID}`,
                    { signal: controller.signal }
                );

                if (responseCol.status === 404) {
                    setColaboraciones([]);
                } else if (responseCol.ok) {
                    const jsonCol = await responseCol.json();

                    setColaboraciones(
                        Array.isArray(jsonCol.data)
                            ? jsonCol.data
                            : []
                    );
                } else {
                    throw new Error('No se pudieron obtener las colaboraciones.');
                }

            } catch (error) {

                if (error.name !== 'AbortError') {
                    console.error(error);
                    toast.error(error.message);
                }

            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        cargarEmpresas();

        return () => controller.abort();

    }, []);

    const seleccionarEmpresa = (businessId, nombre, tipo) => {

        localStorage.setItem(
            'homeBusiness',
            JSON.stringify({
                businessId,
                tipo
            })
        );

        localStorage.setItem(
            'dorsl',
            JSON.stringify(nombre)
        );

        navigate('/home');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-slate-800" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-800">
            <div className="mx-auto mt-14 w-full max-w-6xl space-y-6 px-3 py-6 text-gray-800 sm:px-6">
                <main className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm md:p-6">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900">
                                Mis espacios de trabajo
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Selecciona la empresa que deseas administrar.
                            </p>
                        </div>

                        {/* Empresa propia */}
                        {empresa && (
                            <section className="mb-10">
                                <div className="mb-4 flex items-center gap-2">
                                    <BuildingOffice2Icon className="h-6 w-6 text-orange-500" />
                                    <h2 className="text-lg font-semibold">
                                        Mi empresa
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        seleccionarEmpresa(
                                            empresa.BUSSINESS_ID,
                                            empresa.DORSL,
                                            true
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-orange-400 hover:shadow-md"
                                >
                                    <div>
                                        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

                                            {/* Logotipo de la empresa */}
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">

                                                {!empresa.PHOTO_DORSL?.data?.length ? (
                                                    <BuildingOfficeIcon className="h-8 w-8 text-slate-400" />
                                                ) : (
                                                    <img
                                                        src={
                                                            'data:image/jpeg;base64,' +
                                                            arrayBufferToBase64(empresa.PHOTO_DORSL.data)
                                                        }
                                                        alt={empresa.DORSL}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}

                                            </div>
                                            {/* Información de la empresa */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="break-words text-sm font-bold leading-snug text-slate-900 sm:text-lg">
                                                    {empresa.DORSL}
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                                    Propietario
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 shrink-0 text-orange-500" />
                                </button>
                            </section>
                        )}

                        {/* Colaboraciones */}
                        <section>

                            <div className="mb-4 flex items-center gap-2">
                                <UsersIcon className="h-6 w-6 text-orange-500" />

                                <h2 className="text-lg font-semibold">
                                    Empresas donde colaboro
                                </h2>
                            </div>

                            {colaboraciones.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                    Actualmente no tienes colaboraciones registradas.
                                </div>

                            ) : (

                                <div className="grid gap-4 sm:grid-cols-2">

                                    {colaboraciones.map((colaboracion, index) => {

                                        // Temporal: ajustaremos esta condición al conocer
                                        // el campo real que indica una invitación pendiente.
                                        const pendiente = colaboracion.CONFIRM === 0;

                                        return (
                                            <div
                                                key={colaboracion.ID ?? index}
                                                className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-400 hover:shadow-md sm:p-5"
                                            >
                                                <div className="mb-4 flex min-w-0 items-center gap-3">

                                                    {/* Logotipo */}
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 sm:h-14 sm:w-14">

                                                        {colaboracion.PHOTO == null ? (
                                                            <BuildingOfficeIcon className="h-7 w-7 text-slate-400" />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    'data:image/jpeg;base64,' +
                                                                    arrayBufferToBase64(colaboracion.PHOTO.data)
                                                                }
                                                                alt={colaboracion.DORSL}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}

                                                    </div>

                                                    {/* Nombre y rol */}
                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="break-words text-sm font-bold leading-snug text-slate-900 sm:text-base">
                                                            {colaboracion.DORSL}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                                            {pendiente ? 'Invitación pendiente' : 'Colaborador'}
                                                        </p>

                                                    </div>

                                                    {/* Ícono de colaboradores */}
                                                    <UsersIcon className="hidden h-5 w-5 shrink-0 text-orange-500 sm:block" />

                                                </div>

                                                {pendiente ? (

                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedInvitation(colaboracion)}
                                                        className="w-full rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                                                    >
                                                        Responder invitación
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            seleccionarEmpresa(
                                                                colaboracion.BUSSINESS_ID,
                                                                colaboracion.DORSL,
                                                                colaboracion.TIPO == 0 ? false : true
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                                                    >
                                                        Abrir agenda
                                                        <ArrowRightIcon className="h-4 w-4" />
                                                    </button>

                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                </main>

            </div>
            {selectedInvitation && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="presentation"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !processingInvitation
                        ) {
                            setSelectedInvitation(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="invitation-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h2
                                    id="invitation-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    Invitación a colaborar
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Tienes una invitación pendiente.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={processingInvitation}
                                onClick={() => setSelectedInvitation(null)}
                                aria-label="Cerrar"
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                            <p className="text-sm text-slate-600">
                                Has recibido una invitación para colaborar en:
                            </p>

                            <p className="mt-2 text-lg font-bold text-slate-900">
                                {selectedInvitation.DORSL}
                            </p>
                        </div>

                        <p className="mt-5 text-sm text-slate-600">
                            Si aceptas, podrás acceder al espacio de trabajo
                            según los permisos que te haya asignado la empresa.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                type="button"
                                disabled={processingInvitation}
                                onClick={() => responderInvitacion('rechazar')}
                                className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                                Rechazar
                            </button>

                            <button
                                type="button"
                                disabled={processingInvitation}
                                onClick={() => responderInvitacion('aceptar')}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                            >
                                {processingInvitation ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-t-orange-800" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Aceptar invitación'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>

    );
}