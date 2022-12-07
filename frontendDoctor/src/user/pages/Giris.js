import React, { useState, useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Giris = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formData, setFormData] = useState({
    email : "",
    password : ""
  });
  //console.log(formData);

  const onChangeHandler = event => {
    event.persist();
    setFormData(prevFormData => {
      return{
        ...prevFormData,
        [event.target.name] : event.target.value
      }
    });
  };

  const loginHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/doctors/login',
        'POST',
        JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        { 'Content-Type':'application/json' }
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Giris Sayfasina Hosgeldiniz</h1>
        <hr/>
        <form onSubmit={loginHandler}>
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
          <Button>Giris</Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Giris;