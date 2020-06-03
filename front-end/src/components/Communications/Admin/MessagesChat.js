import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getConversationById } from '../../../services/api/messages';

const MessagesChat = ({ researcherId }) => {
  const [messages, setMessages] = useState([]);
  const fetchConversation = async () => {
    try {
      const response = await getConversationById(researcherId);
      console.log(response);
      setMessages(response);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messagesDisplay = messages.map((mId, index) =>
    mId.ResearcherName === mId.SpeakerName ? (
      <div className="p-4 pr-6 text-gray-200" key={index} style={{ backgroundColor: index % 2 ? '#1E2B34' : '#26343E' }}>
        <div className="flex flex-row">
          <p>{mId.ResearcherName}</p>
          <p>{moment(mId.Created).format('DD/MM/YY')}</p>
          <p>{moment(mId.Created).format('hh:mm A')}</p>
        </div>
        <p className="pt-2 text-sm leading-tight">{mId.Payload}</p>
      </div>
    ) : (
      <div className="flex flex-col items-end p-4 pr-6 text-gray-200" key={index} style={{ backgroundColor: index % 2 ? '#1E2B34' : '#26343E' }}>
        <div className="flex flex-row">
          <p>{mId.ResearcherName}</p>
          <p>{moment(mId.Created).format('DD/MM/YY')}</p>
          <p>{moment(mId.Created).format('hh:mm A')}</p>
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
