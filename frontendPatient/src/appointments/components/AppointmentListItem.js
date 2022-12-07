import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './AppointmentListItem.css';

const AppointmentListItem = props => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      console.log('trying to delete id: '+ props.id);
      const responseData = await sendRequest(
        `http://localhost:5000/api/appointments/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      console.log(responseData);
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Emin misiniz?"
        footerClass="appointment-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              VAZGEC
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              SIL
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Silmek istediğinize emin misiniz?
        </p>
      </Modal>

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
              {auth.userId === props.patientId && (
                <Button danger onClick={showDeleteWarningHandler}>
                  SIL
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