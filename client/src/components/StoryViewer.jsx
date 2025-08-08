import React, { useState, useEffect } from 'react';
import { BadgeCheck, X } from 'lucide-react';

const StoryViewer = ({ viewStory, setViewStory }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer, progressInterval;
        
        if (viewStory && viewStory.media_type !== 'video') {
            setProgress(0);
            const duration = 10000; // 10 seconds
            const intervalTime = 100; // Update every 100ms
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += intervalTime;
                setProgress((elapsed / duration) * 100);
            }, intervalTime);

            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);
        }

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [viewStory, setViewStory]);

    const handleClose = () => {
        setViewStory(null);
    };

    if (!viewStory) return null;

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img 
                        src={viewStory.media_url} 
                        alt="Story" 
                        className='max-w-full max-h-[90vh] object-contain'
                        onError={() => toast.error('Failed to load image')}
                    />
                );
            case 'video':
                return (
                    <video 
                        onEnded={() => setViewStory(null)}
                        src={viewStory.media_url} 
                        className='max-w-full max-h-[90vh]' 
                        controls 
                        autoPlay 
                        muted
                    />
                );
            case 'text':
                return (
                    <div 
                        className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'
                        style={{ backgroundColor: viewStory.background_color }}
                    >
                        {viewStory.content}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className='fixed inset-0 h-screen bg-black bg-opacity-90 z-[110] flex items-center justify-center'
            style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000' }}
        >
            {/* Progress bar */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gray-700 z-10'>
                <div 
                    className='h-full bg-white transition-all duration-100 linear' 
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* User info - top left */}
            <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded-full bg-black/50 z-10'>
                <img 
                    src={viewStory.user?.profile_picture} 
                    alt={viewStory.user?.full_name || 'User'} 
                    className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white'
                />
                <div className='text-white font-medium flex items-center gap-1.5'>
                    <span>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={18} className='text-blue-400'/>
                </div>
            </div>

            {/* Close button */}
            <button 
                onClick={handleClose} 
                className='absolute top-4 right-4 text-white z-10 focus:outline-none'
                aria-label='Close story'
            >
                <X className='w-8 h-8 hover:scale-110 transition cursor-pointer'/>
            </button>

            {/* Content wrapper */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>

            {/* Navigation controls (optional) */}
            <div 
                className='absolute inset-0 flex justify-between z-0'
                onClick={(e) => {
                    // Optional: Add click navigation for next/previous stories
                    const clickX = e.clientX;
                    const windowWidth = window.innerWidth;
                    if (clickX < windowWidth / 3) {
                        // Left click - previous story
                    } else if (clickX > (windowWidth / 3) * 2) {
                        // Right click - next story
                    }
                }}
            />
        </div>
    );
};

export default StoryViewer;