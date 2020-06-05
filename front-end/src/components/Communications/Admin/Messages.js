/* eslint-disable */

import React, { useState, useEffect } from 'react';

import Spinner from  '../../Spinner.js'
import { getConversations } from '../../../services/api/messages';
import arrowRight from '../../../assets/arrowRight.svg'
import search from '../../../assets/search.svg';
import moment from 'moment';
import MessagesChat from './MessagesChat';

export default function Messages() {

  const [ searchTerm, setSearchTerm ] = useState('');
	const [ conversations, setConversations ] = useState([])
  const [ isLoading, setIsLoading ] = useState(true);
	const [ filteredConversations, setFilteredConversations ] = useState([])
	const [ selectedResearcher, setSelectedResearcher ] = useState(null)
	const fetchConversation = async () => {
    try {
			const response = await getConversations();
			setConversations(response);
			setFilteredConversations(response);
      setIsLoading(false);

    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
    const filteredData = conversations.filter(
      conversation => conversation.ResearcherName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = async event => {
    event.preventDefault();
    const { value } = event.target;
    setSearchTerm(value);
  };
	
	const conversationsDisplay = filteredConversations.map((mId, index) => {
		return (
		<div className="h-20 p-4 pr-6 text-gray-200" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
			<div className="flex flex-row justify-between">
				<p className="uppercase">{mId.ResearcherName}</p>
				<div className="flex flex-row">
					<p className="pr-2">{moment(mId.Created).format('DD/MM/YY')}</p>
					<p>{moment(mId.Created).format('hh:mm A')}</p>
				</div>
			</div>
				<p className="pt-2 leading-tight">
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

	  <>
		<div className="relative h-20 bg-blue-900">
			<input
				className="pl-4 mt-6 ml-8 text-gray-200 bg-blue-900 border border-gray-200 border-solid rounded focus:outline-none"
				type="text"
				value={searchTerm}
				name="name"
				onChange={event => handleSearch(event)}
			/>
			<img style={{marginTop: '28px', marginLeft: '215px'}} className="absolute top-0 left-0" src={search} alt="" />
		</div>
	  {selectedResearcher ? <MessagesChat researcherId={selectedResearcher}/> : conversationsDisplay}
	  </>

  );
}
