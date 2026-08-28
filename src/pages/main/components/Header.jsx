import React from 'react';
import * as logo from '../../../assets/images';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import CourseIcon from '../CourseIcon';
import { isAuthenticated, getUserRole } from '../../../utils/tokenUtility';

const Header = () => {
    const authed = Boolean(isAuthenticated());
    const role = getUserRole();

    const dashboardPath =
        role === 'STUDENT' ? '/student-dashboard' : '/Staff-dashboard';

    return (
        <header className="bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-2 gap-3">
                <div className="flex items-center gap-3">
                    <img src={logo.MCP} className="w-10 h-11 md:w-14 md:h-[62px]" />
                    <img src={logo.MCPText} className="w-[140px] md:w-[220px]" />
                </div>

                {authed ? (
                    <div className="flex gap-3">
                        <Link to={dashboardPath}>
                            <Button className="bg-teal-700 text-white rounded-md px-3 py-1 text-sm md:text-base">
                                My Dashboard
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/staffLogin">
                            <Button className="bg-teal-700 text-white rounded-md px-3 py-1 text-sm md:text-base">Staff Login</Button>
                        </Link>
                        <Link to="/studentLogin">
                            <Button className="bg-teal-700 text-white rounded-md px-3 py-1 text-sm md:text-base">Student Login</Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="bg-[#F8F9FC] border-t border-b-[3px] border-[#5862CE]">
                <CourseIcon />
            </div>
        </header>
    );
};

export default Header;
