export interface User {
    name: string;
    email: string;
    role: 'admin' | 'student' | 'mentor';
    avatar?: string;
}
