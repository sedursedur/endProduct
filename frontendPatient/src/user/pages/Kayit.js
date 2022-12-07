import React, { useState, useEffect, useContext} from "react";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Kayit = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    doctorId: ''
  });
  const [loadedDoctors, setLoadedDoctors] = useState([]);

  //console.log(loadedDoctors)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/doctors');
        setLoadedDoctors(responseData.doctors)
      } catch (err) { }
    };
    fetchDoctors();
  }, [sendRequest]);

  const onChangeHandler = event => {
    event.persist();
    //const {name, value, type, checked} = event.target;
    const {name, value} = event.target;
    setFormData(prevData => {
      return {
        ...prevData,
        [name] : value
      }
    });
  };
  
  const signupHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/patients/signup',
        'POST',
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          doctorId: formData.doctorId
        }),
        {'Content-Type':'application/json'}
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Hasta Kayit Formu</h1>
        <hr />

        <form onSubmit={signupHandler}>
          <label htmlFor="doctorId">Doktorunuzu seciniz:</label>
          <select 
            name="doctorId" 
            id="doctorId"
            value={formData.doctorId}
            onChange={onChangeHandler}
          >
            <option value=" ">--  --</option>
            {(loadedDoctors.length !== 0) && loadedDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <br />

          <label htmlFor="name">Isim:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="isim"
            value={formData.name}
            onChange={onChangeHandler}
          />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="email"
            value={formData.email}
            onChange={onChangeHandler}
          />
          <br />

          <label htmlFor="password">Sifre:</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="sifre"
            value={formData.password}
            onChange={onChangeHandler}
          />
          <br />
          <Button>Kayit Ol</Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Kayit;