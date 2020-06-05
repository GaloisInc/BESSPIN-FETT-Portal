/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import send from '../../../assets/send.svg';
import { getConversationById, createMessage } from '../../../services/api/messages';

const MessagesChat = ({ researcherId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const researcher = messages[0].ResearcherId_FK;
      const response = await createMessage(newMessage, researcher);
      if (response) {
        fetchConversation();
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
    <div className="">
      <div className="overflow-y-scroll" style={{ height: '27em' }}>
        {messagesDisplay}
        <div className="sticky" />
      </div>
      <div className="relative p-4" style={{ width: '26em' }}>
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
};

export default MessagesChat;

MessagesChat.propTypes = {
  researcherId: PropTypes.number,
};