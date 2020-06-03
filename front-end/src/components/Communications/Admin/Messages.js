/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { getConversations } from '../../../services/api/messages';
import arrowRight from '../../../assets/arrowRight.svg'
import moment from 'moment';

export default function Messages() {
	
	const [ conversations, setConversations ] = useState([])
	const [ selectedResearcher, setSelectedResearcher ] = useState(null)
	const fetchConversation = async () => {
    try {
			const response = await getConversations();
      console.log(response);
      setConversations(response);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	const conversationsDisplay = conversations.map((mId, index) => {
		<div className="p-4 pr-6 text-gray-200" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
		<div className="flex flex-row">
			<p>{mId.ResearcherName}</p>
			<p>{moment(mId.Created).format('DD/MM/YY')}</p>
			<p>{moment(mId.Created).format('hh:mm A')}</p>
		</div>
		<p className="pt-2 text-sm leading-tight">
			{mId.Payload}
			<span>
				<button type="button">
						<img src={arrowRight} alt=""/>
				</button>
			</span>
		</p>
	</div>
	})
	
  return (
	  <div>
	  	{selectedResearcher ? <MessagesChat /> : conversationsDisplay}
	  </div>
  );
}
