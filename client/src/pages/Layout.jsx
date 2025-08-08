import React, { useState } from 'react'; // Added useState import
import { Menu, X } from 'lucide-react'; // Combined icon imports
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { dummyUserData } from '../assets/assets/assets';
import Loading from '../components/Loading';

const Layout = () => {
    const user = dummyUserData;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return user ? (
        <div className='w-full flex h-screen'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='flex-1 bg-slate-50 overflow-auto'> {/* Added overflow-auto */}
                <Outlet />
            </div>
            {sidebarOpen ? (
                <X 
                    className='fixed top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer' 
                    onClick={() => setSidebarOpen(false)} 
                />
            ) : (
                <Menu 
                    className='fixed top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer' 
                    onClick={() => setSidebarOpen(true)} 
                />
            )}
        </div>
    ) : (
        <Loading />
    );
}

export default Layout;