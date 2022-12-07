import React from "react";

import AppointmentListItem from "./AppointmentListItem";

import './AppointmentList.css';

const AppointmentList = props => {

  return (
    <ul className="appointment-list">
      {props.items.map(appointment => (
        <AppointmentListItem
          key={appointment.id}
          id={appointment.id}
          description={appointment.description}
          feedback={appointment.feedback}
          status={appointment.status}
          date={appointment.date}
          patientId={appointment.patientId}
          doctorId={appointment.patientId.doctorId}
        />
      ))}
    </ul>
  );
};

export default AppointmentList;