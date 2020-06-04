/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { getConversations } from '../../../services/api/messages';
import arrowRight from '../../../assets/arrowRight.svg'
import moment from 'moment';
import MessagesChat from './MessagesChat';

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
		console.log(mId)
		return (
		<div className="h-20 p-4 pr-6 text-gray-200" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
			<div className="flex flex-row justify-between">
				<p className="uppercase">{mId.ResearcherName}</p>
				<div className="flex flex-row">
					<p className="pr-2">{moment(mId.Created).format('DD/MM/YY')}</p>
					<p>{moment(mId.Created).format('hh:mm A')}</p>
				</div>
			</div>
				<p className="pt-2 text-sm leading-tight">
					{mId.Payload.substr(0, 100).trim()}
					<span>
						<button className="pl-4 focus:outline-none" type="button" onClick={() => setSelectedResearcher(mId.ResearcherId_FK)}>
							<img src={arrowRight} alt=""/>
						</button>
					</span>
				</p>
		</div>
		)
	})
	
  return (
	  <div>
	  	{selectedResearcher ? <MessagesChat researcherId={selectedResearcher}/> : conversationsDisplay}
	  </div>
  );
}
