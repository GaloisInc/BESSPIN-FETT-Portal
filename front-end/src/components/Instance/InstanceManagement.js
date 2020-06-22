/* eslint-disable react/display-name */

import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Modal, Paper } from '@material-ui/core';
import search from '../../assets/search.svg';
import settings from '../../assets/settings.svg';
import InstanceModal from './InstanceModal';
import alert from '../../assets/alert.svg';
import { getEnvironments } from '../../services/api/environment';
import useWindowDimensions from '../../services/useDimensions';
import Spinner from '../Spinner.js';

export default function InstanceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [filteredEnvironments, setFilteredEnvironments] = useState([]);
  const { height } = useWindowDimensions();

  const fetchEnvironments = async () => {
    try {
      const response = await getEnvironments();
      setEnvironments(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchEnvironments();
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
      const { CreatedBy } = modalData[0];
      const teamData = environments.filter(env => env.CreatedBy === CreatedBy);
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
    const teamData = environments.filter(env => env.CreatedBy === data.CreatedBy);
    setModalData(teamData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className="relative mr-6 bg-blue-600 table-card"
        style={{ width: '700px', minHeight: '630px', maxHeight: height - 340 }}
      >
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
        <div className="relative overflow-y-scroll fettScroll" style={{ maxHeight: height - 340 }}>
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
                  render: data => <div className="w-3">{data.Status !== 'running' && <img src={alert} alt="" />}</div>,
                },
                { title: 'TEAM', field: 'UserName', width: '8em' },
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
                { title: 'IDLE TIME', field: 'IdleTime', width: '6em' },
                { title: 'STATUS', field: 'Status', width: '6em' },
                {
                  title: '',
                  field: 'detailsView',
                  render: data => (
                    <button type="button" onClick={() => handleOpen(data)} className="focus:outline-none">
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
                sorting: false,
              }}
              data={filteredEnvironments}
            />
          )}
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <InstanceModal
          cardHeight={height - 340}
          handleClose={handleClose}
          isModalLoading={isModalLoading}
          modalData={modalData}
          fetchEnvironments={fetchEnvironments}
        />
      </Modal>
    </>
  );
}
