
export const waait = () => new Promise(res => setTimeout(res, Math.random() * 800));

// local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// delente item
export const deleteItem = ({key, id}) => {
  const existingData = fetchData(key);
  if(id){
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

export const dateSpanish = (_date) => {
  var weekdays= 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_');
  var months= 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_');
  return weekdays[_date.getDay()]+', '+_date.getDate()+' de '+months[_date.getMonth()] +' de '+_date.getFullYear();
}

