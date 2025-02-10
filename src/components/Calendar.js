import React, { useState, useEffect } from "react";
import './table.css';

const getCurrentMonthDates = () => {
  const dates = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  let date = firstDayOfMonth;

  while (date <= lastDayOfMonth) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

const Calendar = () => {
  const [dates, setDates] = useState([]);
  const [dateInput, setDateInput] = useState([]);

  useEffect(() => {
    setDates(getCurrentMonthDates());
    setDateInput(getCurrentMonthDates().map(() => ({
      heureDebut: "00:00",
      heureDepart: "00:00",
      heureavantdebut:"00:00",
      heureapresdepart:"00:00",
      pause:"00:00",
      totalHeures: "0h 0min"
    })));
  }, []);

  const handleTimeChange = (index, field, value) => {
    const updatedInputs = [...dateInput];
    updatedInputs[index][field] = value;

    const heureDebut = updatedInputs[index].heureDebut;
    const heureDepart = updatedInputs[index].heureDepart;
    const heureavantdebut=updatedInputs[index].heureavantdebut;
    const heureapresdepart=updatedInputs[index].heureapresdepart

    if (heureDebut && heureDepart && heureavantdebut && heureapresdepart) {
      const [heureDebutHeure, heureDebutMinute] = heureDebut.split(":").map(num => parseInt(num, 10));
      const [heureDepartHeure, heureDepartMinute] = heureDepart.split(":").map(num => parseInt(num, 10));
      const [heureAvantDebutHeure , heureAvantDebutMinute] = heureavantdebut.split(":").map(num => parseInt( num, 10));
      const [heureApresDepartHeure , heureApresDeepartMinute] = heureapresdepart.split(":").map(num => parseInt( num, 10));

      const debutMinutes = heureDebutHeure * 60 + heureDebutMinute;
      const departMinutes = heureDepartHeure * 60 + heureDepartMinute;
      const AvantdebutMinutes = heureAvantDebutHeure * 60 + heureAvantDebutMinute;
      const ApresdepartMinutes = heureApresDepartHeure * 60 + heureApresDeepartMinute

      let totalMinutes = (AvantdebutMinutes - debutMinutes) + 
                       (departMinutes - ApresdepartMinutes);

      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }

      const totalHeures = Math.floor(totalMinutes / 60);
      const totalMinutesRestantes = totalMinutes % 60;

      updatedInputs[index].totalHeures = `${totalHeures}h ${totalMinutesRestantes}min`;
    }

    setDateInput(updatedInputs);
  };

  const calculateWeeklyTotal = (startIndex) => {
    let totalMinutes = 0;

    for (let i = startIndex; i < startIndex + 7 && i < dateInput.length; i++) {
      if (dateInput[i]?.totalHeures) {
        const [heures, minutes] = dateInput[i].totalHeures.split(/[h min]+/).map(num => parseInt(num) || 0);
        totalMinutes += heures * 60 + minutes;
      }
    }

    const totalHeures = Math.floor(totalMinutes / 60);
    const totalMinutesRestants = totalMinutes % 60;

    return `${totalHeures}h ${totalMinutesRestants}min`;
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return daysOfWeek[date.getDay()];
  };

  const calculateMonthlyTotal = () => {
    let totalMinutes = 0;

    dateInput.forEach(input => {
      if (input.totalHeures) {
        const [heures, minutes] = input.totalHeures.split(/[h min]+/).map(num => parseInt(num) || 0);
        totalMinutes += heures * 60 + minutes;
      }
    });

    const totalHeures = Math.floor(totalMinutes / 60);
    const totalMinutesRestants = totalMinutes % 60;

    return `${totalHeures}h ${totalMinutesRestants}min`;
  };

  return (
    <div>
      <table border={1}>
        <thead>
          <tr>
            <td>Date</td>
            <td>Jour</td>
            <td>Heure de début</td>
            <td>heure avant le pause</td>
            <td>Pause (heures)</td>
            <td>Heure apres la pause</td>
            <td>Heure de départ</td>
            <td>Total (heures)</td>
          </tr>
        </thead>
        <tbody>
          {dates.map((date, index) => {
            const isEndOfWeek = (index + 1) % 7 === 0 || index === dates.length - 1;

            return (
              <React.Fragment key={index}>
                <tr>
                  <td>{date.toLocaleDateString()}</td>
                  <td>{getDayOfWeek(date)}</td>
                  <td>
                    <input
                      type="time"
                      value={dateInput[index]?.heureDebut || ""}
                      onChange={(e) => handleTimeChange(index, "heureDebut", e.target.value)}
                    />
                  </td>
                  <td><input 
                      type="time"
                      value={dateInput[index]?.heureavantdebut || ""}
                      onChange={(e)=> handleTimeChange(index, "heureavantdebut", e.target.value)}></input></td>
                  <td>
                  <input
                      type="time"></input>
                    
                  </td>
                  <td><input
                      type="time"
                      value={dateInput[index]?.heureapresdepart || ""}
                      onChange={(e)=> handleTimeChange(index, "heureapresdepart", e.target.value)}  ></input></td>
                  <td>
                  <input
                      type="time"
                      value={dateInput[index]?.heureDepart || ""}
                      onChange={(e) => handleTimeChange(index, "heureDepart", e.target.value)}
                    />
                  </td>
                  <td>{dateInput[index]?.totalHeures}</td>
                </tr>
                {isEndOfWeek && (
                  <tr>
                    <td colSpan={7}><strong>Total de la semaine</strong></td>
                    <td><strong>{calculateWeeklyTotal(index - (index % 7))}</strong></td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div style={{ textAlign: "right" ,fontWeight: "bold",marginTop: "20px" }}>
        Total du mois : {calculateMonthlyTotal()}
      </div>
    </div>
  );
};

export default Calendar;