import React, { useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
//import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './AppointmentListItem.css';

const AppointmentListItem = props => {
  const { isLoading, error, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      
      {props.status && (
        <li className='appointment-item'>
          <Card className='appoinment-item__content'>
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="appointment-item__info">
              <h3>{new Date(props.date).toString()}</h3>
              <p><b>aciklama:</b> {props.description}</p>
              <p><b>geri bildirim:</b> {props.feedback}</p>
            </div>
            <div className="appointment-item__actions">
              {auth.userId === props.doctorId && (
                <Button to={`/appointments/${props.id}`}>
                  DUZENLE
                </Button>
              )}
            </div>
          </Card>
        </li>
      )}
    </React.Fragment>
  );
};

export default AppointmentListItem;