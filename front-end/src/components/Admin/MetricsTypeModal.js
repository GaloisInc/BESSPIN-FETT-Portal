/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import close from '../../assets/close.svg';
import { getMetricsByType } from '../../services/api/metrics';

const MetricsTypeModal = ({ handleClose, configuration }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [metricsByType, setmetricsByType] = useState([]);

  const fetchMetricsByType = async () => {
    const modalMetrics = await getMetricsByType(configuration.Configuration_FK);
    setmetricsByType(modalMetrics.spinupsTotalByUser);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMetricsByType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countsByUser = metricsByType.map((type, index) => (
    <div
      key={index}
      className={`flex flex-row py-2 pl-4 justify-between ${index % 2 === 0 ? 'bg-blue-700' : 'bg-blue-600'}`}
    >
      <div className="w-full ml-8 mr-8">
        <p className="text-base text-teal-500 uppercase">{type.UserName}</p>
      </div>
      <p className="text-base text-gray-200 pr-16">{type.Count}</p>
    </div>
  ));

  return (
    <div
      className="absolute text-4xl text-gray-200 bg-blue-600"
      style={{ width: '400px', height: '360px', top: '30%', left: '50%', marginLeft: '-200px' }}
    >
      <div className="flex flex-row justify-between py-2 pl-8 pr-6 border-b-2 border-blue-800 border-b-solid ">
        <h4 className="font-medium uppercase">{configuration.Type} user</h4>
        <button type="button" onClick={handleClose} className="focus:outline-none">
          <img src={close} alt="" />
        </button>
      </div>
      {countsByUser}
    </div>
  );
};

export default MetricsTypeModal;

MetricsTypeModal.propTypes = {
  handleClose: PropTypes.func,
  configuration: PropTypes.object,
};
