import React from 'react';
import PropTypes from 'prop-types';
import refresh from '../../assets/refresh.svg';
import close from '../../assets/close.svg';
import InstanceHistoryDetail from './InstanceHistoryDetail';

const InstanceHistoryModal = ({ handleClose, modalData, fetchEnvironments }) => {
  console.log(modalData);
  return (
    <div className="absolute text-4xl text-gray-200 bg-blue-600" style={{ width: '800px', top: '30%', left: '50%', marginLeft: '-400px' }}>
      <div className="flex flex-row items-center justify-between p-2">
        <h5 className="uppercase">
          {modalData.Type} | {modalData.Processor} | {modalData.OS}
        </h5>
        <div className="flex flex-row items-center mr-4">
          <button type="button" className="mr-4 focus:outline-none" onClick={fetchEnvironments}>
            <img src={refresh} alt="" />
          </button>
          <button type="button" onClick={handleClose} className="focus:outline-none">
            <img src={close} alt="" />
          </button>
        </div>
      </div>
      <InstanceHistoryDetail environment={modalData} fetchEnvironments={fetchEnvironments} />
    </div>
  );
};

export default InstanceHistoryModal;

InstanceHistoryModal.propTypes = {
  handleClose: PropTypes.func,
  modalData: PropTypes.object,
  fetchEnvironments: PropTypes.func,
};
