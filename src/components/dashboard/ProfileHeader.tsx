import React from 'react';
import { Button } from '../ui/Button';

interface ProfileHeaderProps {
    name: string;
    appId: string;
    isEnrolled: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, appId, isEnrolled }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1e40af] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-blue-100 shadow-md relative">
                    {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h1 className="text-lg md:text-xl font-black text-[#020617] mb-0.5">
                        Admission Portal: {name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            APP ID: {appId}
                        </span>
                        {isEnrolled && (
                            <span className="bg-blue-50 text-[#1e40af] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Premium Enrolled
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Button variant="primary" size="md" className="shadow-lg shadow-blue-100">
                <span className="mr-2">📄</span> Download Preference List
            </Button>
        </div>
    );
};

export default ProfileHeader;
