import React, { useState, useEffect } from 'react';  // Added missing useState and useEffect imports
import { dummyRecentMessagesData } from '../assets/assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';  // Added missing moment import

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);
    
    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData);
    };

    useEffect(() => {
        fetchRecentMessages();
    }, []);

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>  {/* Fixed typo in text-slate-8 */}
            <div className='flex flex-col max-h-56 overflow-y-auto no-scrollbar'>  {/* Changed overflow-y-scroll to overflow-y-auto */}
                {messages.length > 0 ? (
                    messages.map((message) => (  // Removed unused index parameter
                        <Link 
                            to={`/messages/${message.from_user_id._id}`} 
                            key={message._id}  // Better to use message._id instead of index
                            className='flex items-start gap-2 py-2 px-1 hover:bg-slate-100 rounded transition-colors'  // Added padding and rounded corners
                        >
                            <img 
                                src={message.from_user_id.profile_picture} 
                                alt={message.from_user_id.full_name}  // Better alt text
                                className='w-8 h-8 rounded-full object-cover'  // Added object-cover
                            />
                            <div className='w-full overflow-hidden'>  {/* Added overflow-hidden */}
                                <div className='flex justify-between items-center'>  {/* Added items-center */}
                                    <p className='font-medium truncate'>{message.from_user_id.full_name}</p>  {/* Added truncate */}
                                    <p className='text-[10px] text-slate-400 whitespace-nowrap ml-2'>
                                        {moment(message.createdAt).fromNow()}
                                    </p>
                                </div>
                                <div className='flex justify-between items-center mt-1'>  {/* Added items-center and margin-top */}
                                    <p className='text-gray-500 text-xs truncate'>
                                        {message.text ? message.text : 'Media'}
                                    </p>
                                    {!message.seen && (
                                        <span className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>
                                            1
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-gray-400 text-center py-4'>No recent messages</p>  // Added empty state
                )}
            </div>
        </div>
    );
};

export default RecentMessages;