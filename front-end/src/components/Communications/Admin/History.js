/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Spinner from  '../../Spinner.js'
import { getAnnouncements } from '../../../services/api/announcements';

export default function History() {
	const [ announcements, setAnnouncements ] = useState([])
	const [ isLoading, setIsLoading ] = useState(true);
	const fetchAnnouncements = async () => {
    try {
			const response = await getAnnouncements();
      setAnnouncements(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching announcement: ${error}`);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
	
	const announcementDisplay = announcements.map((aId, index) => {
		return(
			<div className="p-4 pr-6 text-teal-500" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
				<div className="flex items-end flex-column">
				<h6 className="uppercase"><span className="font-bold">Subject:</span> {aId.Type}</h6>
				</div>
				<p className="pt-2 text-sm leading-tight text-gray-200">{aId.Payload}</p>
			</div>
		)
	})

	
  return (
	  <div className="relative">
	  	{isLoading ? <Spinner /> : announcementDisplay};
	  </div>
  );
}
