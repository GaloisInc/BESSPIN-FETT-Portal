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
	
	const messageDisplay = messages.map(mId => {
		return(
			<div>
				{mId.team}
				{mId.date}
				{mId.time}
				<p>{mId.message}</p>
			</div>
		)
	})

	
  return (
	  <div>
	  	{messageDisplay}
	  </div>
  );
}
