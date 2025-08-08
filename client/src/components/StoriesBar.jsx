import React, { useState, useEffect } from 'react';
import { dummyStoriesData } from '../assets/assets/assets';
import { Plus } from 'lucide-react';
import moment from 'moment';
import StoryModal from './StoryModal';
import StoryViewer from './StoryViewer';

const StoriesBar = () => {
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [viewStory,setViewStory]= useState(null)

    const fetchStories = async () => {
        setStories(dummyStoriesData);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* Create Story Card */}
                <div onClick={()=>setShowModal(true)} className='rounded-lg shadow-sm min-w-[120px] max-w-[120px] h-[160px] cursor-pointer hover:shadow-lg transition-all duration-200 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'>
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
                            <Plus className='w-5 h-5 text-white'/>
                        </div>
                        <p className='text-sm font-medium text-slate-700 text-center'>Create Story</p>
                    </div>
                </div>

                {/* Story Cards */}
                {stories.map((story, index) => (
                    <div onClick={()=>setViewStory(story)}
                        key={story.id || index} 
                        className={`relative rounded-lg shadow min-w-[120px] max-w-[120px] h-[160px] cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden`}
                    >
                        {/* Media Background */}
                        {story.media_type !== 'text' && (
                            <div className='absolute inset-0 z-0 rounded-lg overflow-hidden'>
                                {story.media_type === "image" ? (
                                    <img 
                                        src={story.media_url} 
                                        alt="Story Media" 
                                        className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                    />
                                ) : (
                                    <video 
                                        src={story.media_url} 
                                        className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                        autoPlay
                                        muted
                                        loop
                                    />
                                )}
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-1'></div>

                        {/* Story Content */}
                        <img 
                            src={story.user?.profile_picture} 
                            alt={story.user?.name || 'Story'} 
                            className='absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-gray-100 shadow'
                        />
                        <p className='absolute top-14 left-3 right-3 text-white text-sm font-medium truncate z-10'>
                            {story.user?.name}
                        </p>
                        <p className='absolute top-[4.5rem] left-3 right-3 text-white/80 text-xs truncate z-10'>
                            {story.content}
                        </p>
                        <p className='text-white absolute bottom-2 right-2 z-10 text-xs'>
                            {moment(story.createdAt).fromNow()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Add story modal */}
            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories}/>}
            {/* View story modal */}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory}/>}
        </div>
    );
};

export default StoriesBar;