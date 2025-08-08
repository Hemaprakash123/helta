import React, { useState } from 'react';
import { BadgeCheck, MessageCircle, MoreHorizontal, Share2, Heart } from 'lucide-react';
import moment from 'moment';
import { dummyUserData } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>');
    const [likes, setLikes] = useState(post.likes_count || []);
    const currentUser = dummyUserData;

    const handleLike = async () => {
        if (likes.includes(currentUser._id)) {
            setLikes(likes.filter(id => id !== currentUser._id));
        } else {
            setLikes([...likes, currentUser._id]);
        }
    };

    const navigate=useNavigate()

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div  className='flex justify-between items-start'>
                <div  onClick={()=> navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                    <img 
                        src={post.user?.profile_picture} 
                        alt={post.user?.full_name || 'User'} 
                        className='w-10 h-10 rounded-full shadow object-cover'
                    />
                    <div>
                        <div className='flex items-center space-x-1'>
                            <span className='font-medium'>{post.user?.full_name}</span>
                            {post.user?.verified && (
                                <BadgeCheck className='w-4 h-4 text-blue-500 fill-current'/>
                            )}
                        </div>
                        <div className='text-gray-500 text-sm'>
                            @{post.user?.username} · {moment(post.createdAt).fromNow()}
                        </div>
                    </div>
                </div>
                <button className='text-gray-400 hover:text-gray-600'>
                    <MoreHorizontal className='w-5 h-5' />
                </button>
            </div>

            {/* Content */}
            {post.content && (
                <div 
                    className='text-gray-800 text-sm whitespace-pre-line break-words'
                    dangerouslySetInnerHTML={{ __html: postWithHashtags }} 
                />
            )}

            {/* Images */}
            {post.image_urls?.length > 0 && (
                <div className={`grid gap-2 ${post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.image_urls.map((img, index) => (
                        <div key={index} className='relative'>
                            <img 
                                src={img} 
                                alt={`Post Image ${index + 1}`} 
                                className={`w-full rounded-lg object-cover ${post.image_urls.length === 1 ? 'max-h-96' : 'h-48'}`}
                                loading='lazy'
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1 cursor-pointer' onClick={handleLike}>
                    <Heart className={`w-4 h-4 ${likes.includes(currentUser._id) ? 'text-red-500 fill-red-500' : ''}`}/>
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1 cursor-pointer'>
                    <MessageCircle className='w-4 h-4'/>
                    <span>{post.comments_count || 0}</span>
                </div>
                <div className='flex items-center gap-1 cursor-pointer'>
                    <Share2 className='w-4 h-4'/>
                    <span>{post.shares_count || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;