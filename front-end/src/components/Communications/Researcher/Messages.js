/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Spinner from  '../../Spinner.js'
import { getMyMessages } from '../../../services/api/messages';
import moment from 'moment';

export default function Messages() {
	
	const [ messages, setMessages ] = useState([])
	const [ isLoading, setIsLoading ] = useState(true);
	const fetchMessages = async () => {
    try {
			const response = await getMyMessages();
      console.log(response);
      setMessages(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
	
	const messageDisplay = messages.map((mId, index) => {
		return(
			<div className="p-4 pr-6 text-gray-200" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
				<div className="flex flex-column">
					<p>{mId.ResearcherName}</p>
					<p>{moment(mId.Created).format('DD/MM/YY')}</p>
					<p>{moment(mId.Created).format('hh:mm A')}</p>
				</div>
				<p className="pt-2 text-sm leading-tight">{mId.Payload}</p>
			</div>
		)
	})

	
  return (
	  <div className="relative">
	  	{isLoading ? <Spinner /> : messageDisplay};
	  </div>
  );
}
