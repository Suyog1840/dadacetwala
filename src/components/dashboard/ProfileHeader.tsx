import React from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';

interface ProfileHeaderProps {
    name: string;
    appId: string;
    isEnrolled: boolean;
    preferenceListUrl?: string | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, appId, isEnrolled, preferenceListUrl }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1e40af] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-blue-100 shadow-md relative">
                    {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <Heading as="h2" className="mb-0.5 text-lg md:text-xl">
                        Admission Portal: {name}
                    </Heading>
                    <div className="flex items-center gap-2">
                        <Subheading>
                            APP ID: {appId}
                        </Subheading>
                        {isEnrolled && (
                            <span className="bg-blue-50 text-[#1e40af] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Premium Enrolled
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {preferenceListUrl ? (
                <a
                    href={preferenceListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-block" // simple container
                >
                    {/* Render a visual button but using a div to avoid <button> inside <a> */}
                    <div className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-100 flex items-center cursor-pointer transition-colors uppercase tracking-widest">
                        <span className="mr-2">📄</span> Download Preference List
                    </div>
                </a>
            ) : (
                <Button variant="primary" size="md" className="shadow-lg shadow-blue-100 opacity-50 cursor-not-allowed">
                    <span className="mr-2">📄</span> Download Preference List
                </Button>
            )}
        </div>
    );
};

export default ProfileHeader;
