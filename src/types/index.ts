export interface User {
    name: string;
    email: string;
    role: 'admin' | 'student' | 'mentor' | 'unenrolled';
    avatar?: string;
}
