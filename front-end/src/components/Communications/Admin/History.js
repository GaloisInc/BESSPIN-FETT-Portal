/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Spinner from  '../../Spinner.js';
import Broadcast from './Broadcast.js';
import deleteIcon from '../../../assets/delete.svg';
import editIcon from '../../../assets/edit.svg';
import useWindowDimensions from '../../../services/useDimensions'
import { getAnnouncements, disableAnnouncement } from '../../../services/api/announcements';

export default function History() {
	const [ announcements, setAnnouncements ] = useState([])
	const [ isLoading, setIsLoading ] = useState(true);
	const [ isUpdating, setIsUpdating ] = useState(false);
	const { height } = useWindowDimensions();
	
	const fetchAnnouncements = async () => {
	    try {
		  const response = await getAnnouncements();
	      setAnnouncements(response);
	      setIsLoading(false);
	    } catch (error) {
	      console.log(`Error fetching announcement: ${error}`);
	    }
  	};
  	
  	const handleDisable = async (id) => {
	  	console.log(`disabling ${id}`)
	  	setIsLoading(true);
	  	try {
		  const response = await disableAnnouncement(id);
	      fetchAnnouncements();
	      setIsLoading(false);
	      
	    } catch (error) {
	      console.log(`Error disabling announcement: ${error}`);
	    }
  	};
  	
  	const handleUpdate = async (id) => {
		  console.log(`Handling the Update for ${id}`);
		  setIsUpdating(id);
		  
  	};

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  

  const announcementDisplay = isUpdating ? <Broadcast announceID={isUpdating} /> : 
	announcements.map((aId, index) => {
			console.log(aId);
			return(
				<div className="p-4 pr-6 text-teal-500" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
					<div className="flex justify-between flex-column">
					<h6 className="uppercase"><span className="font-bold">Subject:</span> {aId.Type}</h6>
						<ul className="flex justify-between flex-column">
							<li className="mr-2"><img onClick={() => handleUpdate(aId.Id)} src={editIcon} /></li>
							<li className="mr-2"><img onClick={() => handleDisable(aId.Id)} src={deleteIcon} /></li>
						</ul>
					</div>
					<p className="pt-2 text-sm leading-tight text-gray-200">{aId.Payload}</p>
				</div>
			)
		})
	

	
  return (
	  <div className="relative overflow-y-scroll fettScroll" style={{ maxHeight: height - 340 }}>
	  	{isLoading ? <Spinner /> : announcementDisplay};
	  </div>
  );
}
