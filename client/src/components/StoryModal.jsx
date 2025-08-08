import { Sparkle, TextIcon, Upload, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const StoryModal = ({ setShowModal, fetchStories }) => {
    const bgColors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6', '#f43f5e'];
    const [mode, setMode] = useState("text");
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (e.g., 10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB');
                return;
            }
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMode('media');
        }
    };

    const handleCreateStory = async () => {
        try {
            if (mode === 'text' && !text.trim()) {
                throw new Error('Please enter some text');
            }
            if (mode === 'media' && !media) {
                throw new Error('Please upload a photo or video');
            }

            // Here you would typically upload to your backend
            // await api.createStory({ mode, background, text, media });
            
            // After successful creation
            fetchStories();
            setShowModal(false);
            return true;
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className='fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-zinc-900 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <button 
                        onClick={() => setShowModal(false)} 
                        className='text-white p-2 hover:bg-zinc-800 rounded-full transition'
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className='text-lg font-semibold text-white'>Create story</h2>
                    <span className='w-10'></span> {/* Spacer for balance */}
                </div>

                <div className='rounded-lg h-96 flex items-center justify-center relative overflow-hidden' style={{ background }}>
                    {mode === 'text' && (
                        <textarea 
                            className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none placeholder:text-white/60" 
                            placeholder="What's on your mind?"
                            onChange={(e) => setText(e.target.value)} 
                            value={text}
                            maxLength={200}
                            autoFocus
                        />  
                    )}
                    {mode === 'media' && previewUrl && (
                        media?.type.startsWith('image/') ? (
                            <img 
                                src={previewUrl} 
                                alt="Story Media" 
                                className='object-cover w-full h-full'
                                onError={() => toast.error('Failed to load image')}
                            />
                        ) : (
                            <video 
                                src={previewUrl} 
                                className='object-cover w-full h-full' 
                                autoPlay 
                                muted 
                                loop
                                controls={false}
                            />
                        )
                    )}
                </div>

                <div className='flex mt-4 gap-2 overflow-x-auto py-2'>
                    {bgColors.map((color) => (
                        <button 
                            key={color} 
                            className={`w-8 h-8 rounded-full ring-2 cursor-pointer transition-transform ${background === color ? 'ring-white scale-110' : 'ring-transparent'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setBackground(color);
                                setMode('text');
                                setMedia(null);
                                setPreviewUrl(null);
                            }}
                            aria-label={`Select ${color} background`}
                        />
                    ))}
                </div>

                <div className='flex gap-2 mt-4'>
                    <button 
                        onClick={() => {
                            setMode('text');
                            setMedia(null);
                            setPreviewUrl(null);
                        }} 
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded transition ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                    >
                        <TextIcon size={18} /> Text
                    </button>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded transition cursor-pointer ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            className='hidden' 
                            onChange={handleMediaUpload}
                        />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>

                <button 
                    onClick={() => toast.promise(
                        handleCreateStory(),
                        {
                            loading: 'Saving your story...',
                            success: <b>Story published!</b>,
                            error: (e) => <b>{e.message}</b>
                        }
                    )} 
                    className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={(mode === 'text' && !text.trim()) || (mode === 'media' && !media)}
                >
                    <Sparkle size={18} /> Create story
                </button>
            </div>
        </div>
    );
};

export default StoryModal;