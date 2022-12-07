import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './AppointmentForm.css';

const UpdateAppointment = () => {
  const auth = useContext(AuthContext);
  const appointmentId = useParams().appointmentId;
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    feedback: '',
    status: true
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/appointments/${appointmentId}`,
          'GET',
          null,
          { 
            Authorization: 'Bearer ' + auth.token
          }  
        );
        setFormData(prevData => {
          return {
            date: responseData.appointment.date,
            description: responseData.appointment.description,
            feedback: responseData.appointment.feedback,
            status: responseData.appointment.status
          }
        });
      } catch (err) { }
    };
    fetchAppointment();
  },[sendRequest, appointmentId, auth.token]);

  const onChangeHandler = event => {
    event.persist();
    const {name, value, type, checked} = event.target;
    setFormData(prevData => {
      return {
        ...prevData,
        [name] : type === "checkbox" ? checked : value
      }
    });
  };

  const editHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        'PATCH',
        JSON.stringify({
          feedback: formData.feedback,
          status: formData.status
        }),
        {
          Authorization: 'Bearer ' + auth.token,
          'Content-Type':'application/json'
        }
      );
      history.push('/' + auth.userId + '/appointments');
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      
      <form onSubmit={editHandler}>
        <Card className='appoinment-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="appointment-item__info">
            <h3>{new Date(formData.date).toString()}</h3>
            <p><b>aciklama:</b> {formData.description}</p>
            
            <label htmlFor="feedback">Geri Bildirim:</label>
            <input
              type="text"
              name="feedback"
              id="feedback"
              placeholder="geri bildirim"
              value={formData.feedback}
              onChange={onChangeHandler}
            />
            <br /><br />
            <input 
                name="status"
                type="checkbox" 
                id="status" 
                checked={formData.status}
                onChange={onChangeHandler}
            />
            <label htmlFor="status">Randevu Gecerli</label>
          </div>
          <div className="appointment-item__actions">
            <Button> KAYDET </Button>
          </div>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default UpdateAppointment;