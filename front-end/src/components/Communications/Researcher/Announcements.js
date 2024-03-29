import React, { useState, useEffect } from 'react';
import Spinner from '../../Spinner.js';
import { getAnnouncements } from '../../../services/api/announcements';
import '../../../styles/scrollbar.css';

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncements();
      setAnnouncements(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const announcementDisplay = announcements.map((aId, index) => (
    <div className="p-4 text-teal-500" key={index} style={{ backgroundColor: index % 2 ? '#1E2B34' : '#26343E' }}>
      <div className="flex justify-between flex-column">
        <h6 className="uppercase">
          <span className="font-bold">Subject:</span> {aId.Type}
        </h6>
      </div>
      <p className="pt-2 text-sm leading-tight text-gray-200 whitespace-pre-wrap">{aId.Payload}</p>
    </div>
  ));

  return (
    <div className="relative overflow-y-scroll fettScroll" style={{ height: '55vh', overflowX: 'hidden' }}>
      {isLoading ? <Spinner /> : announcementDisplay}
    </div>
  );
}
