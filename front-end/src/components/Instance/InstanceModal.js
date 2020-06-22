import React from 'react';
import PropTypes from 'prop-types';
import close from '../../assets/close.svg';
import InstanceDetail from './InstanceDetail';

const InstanceModal = ({ handleClose, modalData, cardHeight, fetchEnvironments }) => {
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
  const username = mappedData[0].UserName;
  return (
    <div
      className="absolute overflow-y-scroll text-4xl text-gray-200 bg-blue-600"
      style={{ width: '800px', top: '30%', left: '50%', marginLeft: '-400px', maxHeight: cardHeight }}
    >
      <div className="flex flex-row items-center justify-between p-2">
        <h5 className="uppercase">{username}</h5>
        <div className="flex flex-row items-center mr-4">
          <button type="button" onClick={handleClose} className="focus:outline-none">
            <img src={close} alt="" />
          </button>
        </div>
      </div>
      {mappedData}
    </div>
  );
};

export default InstanceModal;

InstanceModal.propTypes = {
  handleClose: PropTypes.func,
  modalData: PropTypes.array,
  cardHeight: PropTypes.number,
  fetchEnvironments: PropTypes.func,
};
