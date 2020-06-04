import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getConversationById } from '../../../services/api/messages';

const MessagesChat = ({ researcherId }) => {
  const [messages, setMessages] = useState([]);
  const fetchConversation = async () => {
    try {
      const response = await getConversationById(researcherId);
      setMessages(response);
    } catch (error) {
      console.log(`Error fetching conversation${error}`);
    }
  };

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <p className="pt-2 text-sm leading-tight">{mId.Payload}</p>
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
        <p className="pt-2 text-sm leading-tight">{mId.Payload}</p>
      </div>
    )
  );

  return <div>{messagesDisplay}</div>;
};

export default MessagesChat;

MessagesChat.propTypes = {
  researcherId: PropTypes.number,
};
