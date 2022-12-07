import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AppointmentList from '../components/AppointmentList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UserAppointments = () => {
  const auth = useContext(AuthContext);
  const [loadedAppointments, setLoadedAppointments] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  
  console.log(loadedAppointments);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/doctors/appointments`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedAppointments(responseData.appointments);
      } catch (err) {}
    };
    fetchAppointments();
  }, [sendRequest, userId, auth]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (loadedAppointments !== undefined ) && (
        <AppointmentList items={loadedAppointments} />
      )}
      {/* {!isLoading && (loadedAppointments === undefined ) && (
        <div className="appointment-list center">
          <Card>
            <h2>Randevu bulunamamistir.</h2>
            <Button to="/appointments/new">Yeni Randevu olustur</Button>
          </Card>
        </div>
      )} */}
    </React.Fragment>
  );
};

export default UserAppointments;
