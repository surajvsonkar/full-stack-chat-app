import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from '../contexts/UserContext';
import { uniqBy } from 'lodash';
import axios from 'axios';
import { connect } from 'mongoose';

const Chat = () => {
	const [ws, setWs] = useState(null);
	const [onlinePeople, setOnlinePeople] = useState({});
	const [selectedUser, setSelectedUser] = useState(null);
	const [newMessageText, setNewMessageText] = useState('');
	const [messages, setMessages] = useState([]);
	const divUnderMessages = useRef()
	const { id } = useContext(UserContext);

	useEffect(() => {
		connectToWs()
		}, []);
		
		function connectToWs(){
		const ws = new WebSocket('ws://localhost:3000');
		setWs(ws);
		ws.addEventListener('message', handleMessage);
		ws.addEventListener('close', ()=> {
			setTimeout(() => {
				console.log('Disconnected. trying to reconnect.')
				connectToWs()
			}, 1000);
		})
		
	}

	function showOnlinePeople(peopleArray) {
		const people = {};
		peopleArray.forEach((element) => {
			people[element.userId] = element.username;
		});
		setOnlinePeople(people);
	}

	function handleMessage(e) {
		const messageData = JSON.parse(e.data);
		console.log(messageData);
		if ('online' in messageData) {
			showOnlinePeople(messageData.online);
		} else if ('text' in messageData) {
			setMessages((prev) => [...prev, { ...messageData }]);
		}
	}

	function sendMessage(ev) {
		ev.preventDefault();
		// console.log(newMessageText);
		ws.send(
			JSON.stringify({
				recipient: selectedUser,
				text: newMessageText,
			})
		);
		setNewMessageText('');
		setMessages((prev) => [
			...prev,
			{
				text: newMessageText,
				sender: id,
				recipient: selectedUser,
				id: Date.now(),
			},
		]);
		// console.log(messages);
	}
	
	useEffect(()=> {
		const div = divUnderMessages.current
		if(div) {
			div.scrollIntoView({behavior: 'smooth', })
		}
	}, [messages])

	useEffect(()=> {
		if(selectedUser){
			axios.get('/messages/'+ selectedUser)
		}
	}, [selectedUser])

	const onlinePeopleExclOurUser = { ...onlinePeople };
	delete onlinePeopleExclOurUser[id];
	const messageWithouDupes = uniqBy(messages, 'id');

	return (
		<div className="flex h-screen">
			<div className="bg-white w-1/3 pl-4 pt-4">
				<Logo />
				{Object.keys(onlinePeopleExclOurUser).map((userId, key) => {
					return (
						<div
							key={key}
							onClick={() => {
								setSelectedUser(userId);
								console.log(selectedUser);
							}}
							className={
								'border-b border-gray-100 items-center cursor-pointer flex gap-2 hover:border hover:border-gray-400 hover:bg-gray-200' +
								(selectedUser === userId
									? ' bg-blue-200 hover:bg-blue-100'
									: '')
							}
						>
							{userId === selectedUser && (
								<div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
							)}
							<div className="flex gap-2 py-2 p-2 items-center justify-center">
								<Avatar username={onlinePeople[userId]} userId={userId} />
								<span>{onlinePeople[userId]}</span>
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex flex-col bg-blue-50 w-2/3 p-2">
				<div className="flex-grow">
					{!selectedUser && (
						<div className="flex justify-center items-center h-full text-gray-300 text-2xl">
							&larr; select a person from the sidebar
						</div>
					)}
					{selectedUser && (
						<div className='relative h-full'>
							<div className="flex flex-col gap-1 overflow-y-scroll absolute inset-0">
								{messageWithouDupes.map((message, index) => {
									// Rename id to index
									return (
										<div
											className={`${
												message.sender === id ? 'text-left' : 'text-right'
											}`}
										>
											<div
												key={index} // Use index as the key
												className={
													`text-left inline-block text-sm font-semibold rounded-md p-2 my-1 ` +
													`${
														message.sender === id
															? 'bg-green-300 '
															: 'bg-red-300 ml-auto'
													}`
												}
											>
												{message.text}
											</div>
										</div>
									);
								})}
								<div ref={divUnderMessages} className=''></div>
							</div>
						</div>
					)}
				</div>
				{selectedUser && (
					<form className="flex gap-2 mx-2" onSubmit={sendMessage}>
						<input
							value={newMessageText}
							onChange={(e) => setNewMessageText(e.target.value)}
							type="text"
							placeholder="type your message here"
							className="bg-white rounded-sm flex-grow border p-2"
						/>
						<button
							type="submit"
							className="bg-blue-500 rounded-sm p-2 text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
								/>
							</svg>
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Chat;
