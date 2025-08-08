import React from 'react'
import { assets } from '../assets/assets/assets'
import { Star } from 'lucide-react' // Corrected import
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
    return (
        <div className='min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100'>
            <img src={assets.bgImage} alt="" className='absolute top-0 left-0 -z-10 w-full h-full object-cover' />

            <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
                <img src={assets.logo} alt="Logo" className='h-24 object-contain' /> {/* Fixed image tag */}
                <div>
                    <div className='flex items-center gap-2'> {/* Added flex for layout */}
                        <img src={assets.group_users} alt="" className='h-8 md:h-10' />
                        <div>
                            <div className='flex'> {/* Added flex for stars */}
                                {Array(5).fill(0).map((_,i) => (
                                    <Star key={i} className='size-4 md:size-5 text-amber-500 fill-amber-500'/> 
                                ))}
                            </div>
                            <p>Used by developers</p> 
                        </div>
                    </div>
                    <h1 className='text-3xl md:text-6xl md:pb-2 font-bold '>Just friends truly connect</h1>
                    <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>Connect with golbal community</p>
                </div>
                <span className='md:h-10'></span>

                <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
                     <SignIn/>
                </div>
            </div>
        </div>
    )
}

export default Login