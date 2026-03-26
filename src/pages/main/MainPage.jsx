import React from 'react';
import * as logo from '../../assets/images';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import CourseIcon from './CourseIcon';

const MainPage = () => {
    return (
        <>
        <div className='flex justify-between px-6 py-4'>
            <div className='flex'>
                <img src={logo.MCP} className='w-[85px] h-[94px]' />
                <img src={logo.MCPText} width="341" height="86" className='pl-8' />
            </div>    

                <div className='flex items-center gap-3'>
                    <Link to="/staffLogin">
                        <Button className='bg-teal-700  text-white rounded-[8px]'>Staff Login</Button>
                    </Link>
                    <Link to="/studentLogin">
                        <Button className='bg-teal-700 text-white rounded-[8px] pl-[10px]'>Student Login</Button>
                    </Link>
                </div>
            </div> 
            
            <hr className='border-b-[3px] border-[#5862CE]' />
            <CourseIcon />
        </>
    );
}

export default MainPage