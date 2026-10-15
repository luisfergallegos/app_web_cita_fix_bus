// rrd imports
import { useState } from "react";
import { urlApi } from "../../styles/Constants.jsx";
import { toast } from "react-toastify";
//librery
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function UpdateSchedule({ excludeTimes, horario, businessId, setshowAlertConfirmation, busSpacesId }) {
    const listIntervaloDes = ['30 min', '45 min', '1 hora', '2 horas'];
    const [valuesDefault, setValuesDefault] = useState(horario);

    const handleChangeCheckbox = (indexToUpdate, evt) => {
        const value = evt.target.checked;
        if (value) {
            var newValue = valuesDefault[indexToUpdate];
            newValue['value'] = 1;
            setValuesDefault(valuesDefault.map((item, index) =>
                index == indexToUpdate ? newValue : item
            ));
        }
        else {
            var newValue = valuesDefault[indexToUpdate];
            newValue['value'] = 0;
            setValuesDefault(valuesDefault.map((item, index) =>
                index == indexToUpdate ? newValue : item
            ));

        }
    };

    const handleChangeDesde = (value, indexToUpdate) => {
        const hour = ('0' + value.getHours()).slice(-2);
        var newValue = valuesDefault[indexToUpdate];
        newValue['desdeH'] = hour;
        setValuesDefault(valuesDefault.map((item, index) =>
            index == indexToUpdate ? newValue : item
        ));
    };

    const handleChangeHasta = (value, indexToUpdate) => {
        const hour = ('0' + value.getHours()).slice(-2);
        var newValue = valuesDefault[indexToUpdate];
        newValue['hastaH'] = hour;
        setValuesDefault(valuesDefault.map((item, index) =>
            index == indexToUpdate ? newValue : item
        ));
    };

    const handleChangeIntervalo = (indexToUpdateIntervalo, indexToUpdate) => {
        var dIntervalo = '0.5_0.75_1_2'.split('_');
        var _intervaloDes = '30 min_45 min_1 hora_2 horas'.split('_');
        var newValue = valuesDefault[indexToUpdate];
        newValue['intervalo'] = dIntervalo[indexToUpdateIntervalo];
        newValue['intervaloDes'] = _intervaloDes[indexToUpdateIntervalo];
        setValuesDefault(valuesDefault.map((item, index) =>
            index == indexToUpdate ? newValue : item
        ));
    };

    const btnRegisterSchedule = async (e) => {
        var iCountDiasMal = 0;
        for (var val in valuesDefault) {
            var element = valuesDefault[val];
            if (element['desdeH'] > element['hastaH']) {
                iCountDiasMal = iCountDiasMal + 1;
            }
        }
        if (iCountDiasMal == 0) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "bussiness_id": businessId,
                        "bus_spaces_id": busSpacesId,
                        "data": valuesDefault,
                    })
            }
            try {
                const response = await fetch(`${urlApi}schedule`, options);
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
        else {
            toast.error('Es posible que exista un hora incorrecta o no válido');
        }
    };

    return (
        <div>
            <div className="grid">
                <span className="mb-2">Las personas pueden elegir la fecha y la hora de su cita en función del calendario que configures.</span>
                <span className="mb-2">CALENDARIO</span>
                <span>Elige los días y horarios disponibles para realizar citas en tu calendario.</span>
            </div>
            {
                valuesDefault.map((valor, index) => (
                    <div className='GroupLabel pr-10 mt-2'>
                        <div className="flex items-center px-4 border border-gray-300 rounded-sm ">
                            <label className="w-full py-4 ms-2 text-sm font-medium">{valor['day_name']}</label>
                            <input className="w-2 h-2 rounded-sm"
                                type="checkbox" defaultChecked={valor['value'] == 0 ? false : true} onClick={(evt) => { handleChangeCheckbox(index, evt); }} />
                        </div>
                        {
                            valor['value'] == 1 && (
                                <div>
                                    <div className="flex">
                                        <div className="grid">
                                            <label>Abrir</label>
                                            <DatePicker
                                                dateFormat="h:mm aa"
                                                selected={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), valor['desdeH'], valor['desdeM'], '00')}
                                                onChange={(date) => { handleChangeDesde(date, index); }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                showTimeCaption={false}
                                                excludeTimes={excludeTimes}
                                            />
                                        </div>
                                        <div className="grid">
                                            <label>Cerrar</label>
                                            <DatePicker
                                                dateFormat="h:mm aa"
                                                selected={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), valor['hastaH'], valor['hastaM'], '00')}
                                                onChange={(date) => { handleChangeHasta(date, index); }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                showTimeCaption={false}
                                                excludeTimes={excludeTimes}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex mt-2 mb-2">
                                        <label className="mr-2">Intervalo de tiempo</label>
                                        {
                                            <select name="" id="">
                                                {
                                                    listIntervaloDes.map((Intervalo, indexIntervalo) => (
                                                        Intervalo == valor['intervaloDes'] ?
                                                            <option value={Intervalo} selected onClick={() => (handleChangeIntervalo(indexIntervalo, index))}>{Intervalo}</option> :
                                                            <option value={Intervalo} onClick={() => (handleChangeIntervalo(indexIntervalo, index))} >{Intervalo}</option>
                                                    )
                                                    )
                                                }
                                            </select>
                                        }
                                    </div>
                                </div>
                            )
                        }
                        {/* <div className='businessContainer_Divider'></div> */}
                    </div>
                ))
            }
            <div>
                <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600" onClick={() => (btnRegisterSchedule())} >Guardar</button>
            </div>
        </div>);
}

export default UpdateSchedule;