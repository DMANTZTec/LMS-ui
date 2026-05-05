import React from 'react';
import * as logo from '../../assets/images';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import CourseIcon from './CourseIcon';

const MainPage = () => {
    return (
        <>
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 gap-4">
            <div className="flex items-center gap-4">
                <img src={logo.MCP} className="w-14 h-16 md:w-[85px] md:h-[94px]" />
                <img src={logo.MCPText} className="w-[180px] md:w-[341px]" />
            </div>    

                <div className="flex gap-3">
                    <Link to="/staffLogin">
                        <Button className="bg-teal-700 text-white rounded-md px-3 py-1 text-sm md:text-base">Staff Login</Button>
                    </Link>
                    <Link to="/studentLogin">
                        <Button className="bg-teal-700 text-white rounded-md px-3 py-1 text-sm md:text-base">Student Login</Button>
                    </Link>
                </div>
            </div> 
            
            <hr className='border-b-[3px] border-[#5862CE]' />
            <CourseIcon />
        </>
    );
}

export default MainPage