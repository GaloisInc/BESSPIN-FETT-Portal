/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Spinner from  '../../Spinner.js'
import { getMyMessages } from '../../../services/api/messages';
import moment from 'moment';
import send from '../../../assets/send.svg';
import { createMessage } from '../../../services/api/messages';
import useWindowDimensions from '../../../services/useDimensions'

export default function Messages() {
	
	const [ messages, setMessages ] = useState([])
	const [ researcherID, setResearcherId] = useState('');
	const [newMessage, setNewMessage] = useState('');
	const [ isLoading, setIsLoading ] = useState(true);
	const { height } = useWindowDimensions();
	
	const fetchMessages = async () => {
    try {
			const response = await getMyMessages();
      console.log('Get my messages response ' + response);
	  setMessages(response);
	  setResearcherId(response[0].ResearcherId_FK);
	  setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await createMessage(newMessage, researcherID);
      if (response) {
        fetchMessages();
      }
      setNewMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };
	
  const messagesDisplay = messages.map((mId, index) =>
  mId.ResearcherName === mId.SpeakerName ? (
	<div className="p-4 pr-20 text-gray-200 " key={index} style={{ backgroundColor: index % 2 ? '#1E2B34' : '#26343E' }}>
	  <div className="flex flex-row justify-between">
		<p className="uppercase">{mId.SpeakerName}</p>
		<div className="flex flex-row">
		  <p className="pr-2">{moment(mId.Created).format('DD/MM/YY')}</p>
		  <p>{moment(mId.Created).format('hh:mm A')}</p>
		</div>
	  </div>
	  <p className="pt-2 leading-tight">{mId.Payload}</p>
	</div>
  ) : (
	<div className="flex flex-col p-4 pl-20 pr-6 text-gray-200 " key={index} style={{ backgroundColor: index % 2 ? '#1E2B34' : '#26343E' }}>
	  <div className="flex flex-row justify-between">
		<div className="flex flex-row">
		  <p className="pr-2">{moment(mId.Created).format('DD/MM/YY')}</p>
		  <p>{moment(mId.Created).format('hh:mm A')}</p>
		</div>
		<p className="uppercase">{mId.SpeakerName}</p>
	  </div>
	  <p className="pt-2 leading-tight">{mId.Payload}</p>
	</div>
  )
);

	
  return (
	  <div className="relative overflow-y-scroll" style={{ minHeight: '630px', maxHeight: height - 340 }}>
	  	{isLoading ? <Spinner /> : messagesDisplay}

		<div className="p-4 sticky bottom-0 bg-blue-700" style={{ width: '26em' }}>
			<input
			placeholder="type to chat"
			id="newMessage"
			value={newMessage}
			onChange={event => setNewMessage(event.target.value)}
			className="p-2 pl-4 text-xs text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
			style={{ width: '33.5em' }}
			onKeyPress={handleKeyPress}
			/>
			<button type="submit" className="absolute top-0 right-0 pl-2 mt-6 mr-1 border-l" onClick={handleSubmit}>
			<img src={send} alt="" />
			</button>
		</div>

	  </div>
  );
}
