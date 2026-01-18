export interface User {
    name: string;
    email: string;
    role: 'admin' | 'student' | 'mentor' | 'unenrolled' | 'super_admin';
    avatar?: string;
    isEnrolled?: boolean;
}
