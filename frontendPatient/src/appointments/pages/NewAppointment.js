import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import TextField from '@mui/material/TextField';

import './AppointmentForm.css';

const NewAppointment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const [formData, setFormData] = useState({
    date: '',
    description: ''
  });
  //console.log(formData.date +':'+ formData.description);
  const onChangeHandler = event => {
    event.persist();
    const {name, value} = event.target;
    setFormData(prevData => {
      return {
        ...prevData,
        [name] : value
      }
    });
  };
  const history = useHistory();

  const signupHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/appointments/patients/',
        'POST',
        JSON.stringify({
          date: formData.date,
          description: formData.description,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        },
      );
      history.push('/');
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="appointment">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Yeni Randevu Formu</h1>
        <hr />
        <form onSubmit={signupHandler}>
          <label htmlFor='date'>Tarih ve Saat Seçiniz</label>
          <TextField
            name="date"
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={onChangeHandler}
            sx={{ width: 250 }}
          />
          <br /><br />

          <label htmlFor="description">Aciklama:</label>
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="randevu alma nedeninizi yaziniz."
            value={formData.description}
            onChange={onChangeHandler}
          />
          <br />
          <Button>Randevu Olustur</Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewAppointment;