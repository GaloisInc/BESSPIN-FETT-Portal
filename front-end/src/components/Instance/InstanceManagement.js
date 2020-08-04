/* eslint-disable react/display-name */
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Modal, Paper } from '@material-ui/core';
import moment from 'moment';
import search from '../../assets/search.svg';
import settings from '../../assets/settings.svg';
import InstanceModal from './InstanceModal';
import { getEnvironments } from '../../services/api/environment';
import useWindowDimensions from '../../services/useDimensions';
import Spinner from '../Spinner.js';
import Alert from './Alert';

export default function InstanceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [filteredEnvironments, setFilteredEnvironments] = useState([]);
  const [updateTime, setUpdateTime] = useState('');
  const { height } = useWindowDimensions();

  const fetchEnvironments = async () => {
    try {
      const response = await getEnvironments();
      setUpdateTime(`${moment().format('l')}, ${moment().format('LTS')}`);
      setEnvironments(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchEnvironments();
    const interval = setInterval(() => {
      fetchEnvironments();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredData = environments.filter(
      env =>
        env.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.OS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.Processor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        env.Status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnvironments(filteredData);
    if (open) {
      const { Id } = modalData[0];
      // const teamData = environments.filter(env => env.CreatedBy_FK === CreatedBy_FK);
      const teamData = environments.filter(env => env.Id === Id);

      setModalData(teamData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, environments]);

  const handleSearch = event => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleOpen = async data => {
    setIsModalLoading(true);
    // const teamData = environments.filter(env => env.CreatedBy_FK === data.CreatedBy_FK);
    const teamData = environments.filter(env => env.Id === data.Id);
    setModalData(teamData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="mr-6 bg-blue-600 table-card">
        <div className="flex flex-row items-center justify-between pl-4 mt-4 mb-2">
          <h5 className="font-medium text-gray-200 uppercase">environment management</h5>
          <div className="flex flex-row items-center mr-4">
            <form className="relative">
              <input
                className="pl-4 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded focus:outline-none"
                type="text"
                value={searchTerm}
                name="name"
                onChange={event => setSearchTerm(event.target.value)}
                onSubmit={handleSearch}
              />
              <img className="absolute top-0 right-0 mt-1 mr-2" src={search} alt="" />
            </form>
          </div>
        </div>
        <div className="relative overflow-y-scroll fettScroll" style={{ height: '55vh' }}>
          {isLoading ? (
            <Spinner />
          ) : (
            <MaterialTable
              components={{
                Container: props => <Paper {...props} elevation={0} />,
              }}
              columns={[
                {
                  title: '',
                  field: 'alert',
                  width: '1em',
                  sorting: false,
                  render: data => (
                    <div className="w-3">
                      <Alert status={data.Status} />
                    </div>
                  ),
                },
                { title: 'TEAM', field: 'UserName' },
                { title: 'CodeName', field: 'CodeName', width: '7em' },
                {
                  title: 'F1 INSTANCE',
                  field: 'f1Instance',
                  width: '16em',
                  render: data => (
                    <p>
                      {data.Type} | {data.Processor} | {data.OS}
                    </p>
                  ),
                },
                { title: 'Fett Ip', field: 'FPGAIp' },
                { title: 'F1 Ip', field: 'IpAddress' },
                { title: 'Region', field: 'Region' },
                { title: 'STATUS', field: 'Status' },
                {
                  title: 'Metrics',
                  field: 'metrics',
                  render: data => (
                    <button
                      disabled={
                        data.Status === 'provisioning' ||
                        data.Status === 'terminated' ||
                        data.Status === 'queueing' ||
                        !data.FPGAIp
                      }
                      className={`px-4 ${
                        data.Status === 'provisioning' ||
                        data.Status === 'terminated' ||
                        data.Status === 'queueing' ||
                        !data.FPGAIp
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200'
                      } rounded`}
                      type="button"
                    >
                      <p className="text-sm text-blue-900 uppercase">
                        {data.Status === 'provisioning' ||
                        data.Status === 'terminated' ||
                        data.Status === 'queueing' ||
                        !data.FPGAIp ? (
                          'Metrics'
                        ) : (
                          <a
                            href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards:name=FettPortal${
                              data.F1EnvironmentId
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Metrics
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },
                {
                  title: 'User Logs',
                  field: '',
                  render: data => (
                    <button
                      className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-24 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        !data.F1EnvironmentId
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
                      }`}
                      type="button"
                      disabled={!data.F1EnvironmentId}
                    >
                      <p className="text-sm font-medium text-blue-900 uppercase">
                        {!data.F1EnvironmentId ? (
                          'User Logs'
                        ) : (
                          <a
                            className="font-medium"
                            href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=${
                              data.Region
                            }#logsV2:log-groups/log-group/user-data.log/log-events/${data.F1EnvironmentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            User Logs
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },
                {
                  title: 'FETT Logs',
                  field: '',
                  render: data => (
                    <button
                      className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-24 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        !data.F1EnvironmentId
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
                      }`}
                      type="button"
                      disabled={!data.F1EnvironmentId}
                    >
                      <p className="text-sm text-blue-900 uppercase">
                        {!data.F1EnvironmentId ? (
                          'Fett Logs'
                        ) : (
                          <a
                            href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=${
                              data.Region
                            }#logsV2:log-groups/log-group/fett.log/log-events/${data.F1EnvironmentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            FETT Logs
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },
                {
                  title: 'TTY Logs',
                  field: '',
                  render: data => (
                    <button
                      className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-24 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        !data.F1EnvironmentId
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
                      }`}
                      type="button"
                      disabled={!data.F1EnvironmentId}
                    >
                      <p className="text-sm text-blue-900 uppercase">
                        {!data.F1EnvironmentId ? (
                          'TTY Logs'
                        ) : (
                          <a
                            href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=${
                              data.Region
                            }#logsV2:log-groups/log-group/tty.out/log-events/${data.F1EnvironmentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            TTY Logs
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },
                {
                  title: 'Shell Logs',
                  field: '',
                  render: data => (
                    <button
                      className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-24 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        !data.F1EnvironmentId
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
                      }`}
                      type="button"
                      disabled={!data.F1EnvironmentId}
                    >
                      <p className="text-sm text-blue-900 uppercase">
                        {!data.F1EnvironmentId ? (
                          'Shell Logs'
                        ) : (
                          <a
                            href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=${
                              data.Region
                            }#logsV2:log-groups/log-group/shell.out/log-events/${data.F1EnvironmentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Shell Logs
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },
                {
                  title: 'S3 Logs',
                  field: '',
                  render: data => (
                    <button
                      className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-24 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        !data.F1EnvironmentId
                          ? 'bg-gray-600 cursor-default'
                          : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
                      }`}
                      type="button"
                      disabled={!data.F1EnvironmentId}
                    >
                      <p className="text-sm text-blue-900 uppercase">
                        {!data.F1EnvironmentId ? (
                          's3 Logs'
                        ) : (
                          <a
                            href={`https://s3.console.aws.amazon.com/s3/buckets/${
                              process.env.NODE_ENV === 'development' ? 'develop' : 'master'
                            }-ssith-fett-target-researcher-artifacts/fett-target/production/artifacts/?region=us-west-2&tab=overview`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            S3 Logs
                          </a>
                        )}
                      </p>
                    </button>
                  ),
                },

                {
                  title: '',
                  field: 'detailsView',
                  sorting: false,
                  width: '4em',
                  render: data => (
                    <button type="button" onClick={() => handleOpen(data)} className="focus:outline-none w-5">
                      <img src={settings} alt="" />
                    </button>
                  ),
                },
              ]}
              options={{
                headerStyle: {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#1E2B34',
                  color: '#46878E',
                  fontSize: '1em',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                },
                rowStyle: rowData => ({
                  backgroundColor: rowData.tableData.id % 2 ? '#293A46' : '#26343E',
                  color: '#F4F4F4',
                  textTransform: 'uppercase',
                }),
                paging: false,
                search: false,
                showTitle: false,
                toolbar: false,
                draggable: false,
              }}
              data={filteredEnvironments}
            />
          )}
        </div>
        <div className="flex flex-row justify-end p-4">
          <p className="text-xs text-gray-500">Last Updated: {updateTime}</p>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <InstanceModal
          cardHeight={height - 400}
          handleClose={handleClose}
          isModalLoading={isModalLoading}
          modalData={modalData}
          fetchEnvironments={fetchEnvironments}
        />
      </Modal>
    </>
  );
}
