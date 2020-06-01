/* eslint-disable */

import React, { useState } from 'react';

export default function Messages() {
	
	const messages = [
		{
			team: 'Team Two',
			date: '6/22/20',
			time: '1:45pm',
			message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut la'
		},
		{
			team: 'Team One',
			date: '6/22/20',
			time: '1:47pm',
			message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut la'
		},
		{
			team: 'Admin',
			date: '6/22/20',
			time: '1:54pm',
			message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut la'
		}
	]
	
	const messageDisplay = messages.map((mId, index) => {
		return(
			<div className="p-4 pr-6 text-gray-200" key={index} style={{backgroundColor: index % 2 ? '#1E2B34' : '#26343E'}}>
				<div className="flex flex-column">
					<p>{mId.team}</p>
					<p>{mId.date}</p>
					<p>{mId.time}</p>
				</div>
				<p className="text-sm leading-tight pt-2">{mId.message}</p>
			</div>
		)
	})

	
  return (
	  <div>
	  	{messageDisplay}
	  </div>
  );
}
