import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@material-ui/core';
import close from '../../assets/close.svg';
import InstanceDetail from './InstanceDetail';

const InstanceModal = ({ handleClose, modalData, cardHeight, fetchEnvironments, open }) => {
  console.log(modalData);
  const mappedData = modalData.map((env, index) => (
    <InstanceDetail
      key={index}
      environment={env}
      index={index}
      fetchEnvironments={fetchEnvironments}
      handleClose={handleClose}
    />
  ));
  const username = modalData[0]?.UserName;
  console.log(cardHeight);
  return (
    <Modal open={open} onClose={handleClose}>
      <div
        className="absolute text-4xl text-gray-200 bg-blue-600"
        style={{ width: '800px', top: '30%', left: '50%', marginLeft: '-400px', maxHeight: cardHeight + 50 }}
      >
        <div className="flex flex-row items-center justify-between p-4 ">
          <h5 className="uppercase">{username}</h5>
          <div className="flex flex-row items-center mr-4">
            <button type="button" onClick={handleClose} className="focus:outline-none">
              <img src={close} alt="" />
            </button>
          </div>
        </div>
        <div className="overflow-y-scroll fettScroll" style={{ maxHeight: cardHeight - 100 }}>
          {mappedData}
        </div>
        <div />
      </div>
    </Modal>
  );
};

export default InstanceModal;

InstanceModal.propTypes = {
  handleClose: PropTypes.func,
  modalData: PropTypes.array,
  cardHeight: PropTypes.number,
  fetchEnvironments: PropTypes.func,
  open: PropTypes.bool,
};
