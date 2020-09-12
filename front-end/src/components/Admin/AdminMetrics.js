import React, { useState, useEffect } from 'react';
import moment from 'moment/min/moment-with-locales';
import { getMetrics } from '../../services/api/metrics';
import Spinner from '../Spinner';
import MetricsTypeModal from './MetricsTypeModal';
import useWindowDimensions from '../../services/useDimensions';

export default function AdminDash() {
  const [open, setOpen] = React.useState(false);
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({});

  const { height } = useWindowDimensions();

  const fetchMetrics = async () => {
    const results = await getMetrics();
    setMetrics(results);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(modalConfiguration);
    if (Object.keys(modalConfiguration).length > 0) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalConfiguration]);

  const handleClose = () => {
    setOpen(false);
  };

  const spinupsByType =
    metrics.spinupsTotalByType &&
    metrics.spinupsTotalByType.map((type, index) => (
      <button
        key={index}
        className={`flex flex-row text-left py-2 pl-4 w-full ${index % 2 === 0 ? 'bg-blue-700' : 'bg-blue-600'}`}
        onClick={() => setModalConfiguration(type)}
        type="button"
      >
        <div className="w-full ml-8 mr-8 ">
          <p className="text-base text-teal-500 uppercase">{`${type.Type} | ${type.Processor} | ${type.OS} | ${
            type.Variant
          }`}</p>
        </div>
        <div className="flex flex-row justify-between pr-8 w-1/6">
          <p className="text-base text-gray-200">{type.Count}</p>
          <p className="text-base text-gray-200">({type.ResetCounts})</p>
        </div>
      </button>
    ));

  const handleScroll = e => e.target.classList.add('fettScroll');

  return (
    <div className="overflow-y-scroll w-full" onScroll={handleScroll}>
      <div className="h-full pt-6 pl-12 pr-12 w-full " style={{ height: '85vh', maxWidth: '900px' }}>
        <h3 className="text-gray-200 uppercase">metrics</h3>
        <p className="pt-4 text-gray-200">
          This interface may be used to view all instances provisioned by any research team as well as to connect to AWS
          logs/metrics for specific instances.
        </p>
        <div className="w-full mt-4">
          <div className="relative mr-6 bg-blue-600 table-card w-full">
            {isLoading ? (
              <div className="p-12">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="flex flex-row items-center justify-between pl-4 mt-4 mb-2">
                  <h5 className="font-medium text-gray-200 uppercase">Reporting Metrics</h5>
                  <div className="flex flex-row items-center mr-4" />
                </div>
                <div className="flex flex-row py-2 px-4 bg-blue-900">
                  <p className="text-base text-teal-500 uppercase">Portal Data *</p>
                </div>
                <div className="flex flex-row py-2 bg-blue-700">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">Launches</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">{metrics && metrics.spinups}</p>
                </div>
                <div className="flex flex-row py-2 bg-blue-600">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">Terminations</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">{metrics && metrics.terminationsTotal}</p>
                </div>
                <div className="flex flex-row py-2 bg-blue-700">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">Errors Launching</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">{metrics && metrics.spinupErrorsTotal}</p>
                </div>
                <div className="flex flex-row py-2 bg-blue-600">
                  <div className="w-full ml-8 mr-8 ">
                    {/* <p className="text-base text-teal-500 uppercase">Launches By Type</p> */}
                    <p className="text-base text-teal-500 uppercase">Launches By Type (Resets By Type) </p>
                  </div>
                </div>
                <div>{spinupsByType}</div>
                <p className="text-xs pr-8 pl-4  pb-4 text-gray-500">{`* Data include activity since ${moment(
                  '07-15-20 10:00:00 PDT'
                ).format('l, LT')} and do not include test profile activity`}</p>
                <div className=" flex flex-row py-2 px-4 bg-blue-900">
                  <p className="text-base text-teal-500 uppercase">AWS Account Data</p>
                </div>
                <div className="flex flex-row py-2 bg-blue-700">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">F1 Running Hours **</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">
                    {metrics && metrics.f1Hours && metrics.f1Hours.hoursTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-row py-2 bg-blue-600">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">F1 Running Hours (MTD)**</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">
                    {metrics && metrics.monthlyHours && metrics.monthlyHours.hoursTotal > 0
                      ? metrics.monthlyHours.hoursTotal.toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-row py-2 bg-blue-700">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">Account Costs ***</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">
                    {metrics && metrics.costData && metrics.costData.costTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-row py-2 bg-blue-600">
                  <div className="w-full ml-8 mr-8 ">
                    <p className="text-base text-teal-500 uppercase">Account Costs (MTD)***</p>
                  </div>
                  <p className="text-base pr-8 text-gray-200">
                    {metrics && metrics.monthlyCosts && metrics.monthlyCosts.costTotal > 0
                      ? metrics.monthlyCosts.costTotal.toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
                <p className="text-xs pr-8 pl-4  pb-2 text-gray-500">
                  {metrics &&
                    metrics.f1Hours &&
                    `** Available data ranges from ${moment('07-15-20 10:00:00 PDT').format('l, LT')} and ${moment(
                      metrics.f1Hours.periodEnd
                    ).format(
                      'l, LT'
                    )}. They include hours from all f1 instances (i.e., researchers, developers and infrastructure) `}
                </p>
                <p className="text-xs pr-8 pl-4  pb-2 text-gray-500">
                  {metrics &&
                    metrics.costData &&
                    `*** Available data ranges from ${moment('07-15-20 10:00:00 PDT').format('l, LT')} and ${moment(
                      metrics.costData.periodEnd
                    ).format('l, LT')}.  They include all costs associated with infrastructure and researcher uses`}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <MetricsTypeModal
        handleClose={handleClose}
        configuration={modalConfiguration}
        cardHeight={height - 400}
        open={open}
      />
    </div>
  );
}
