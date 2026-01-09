// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '../../../components/ui/Button';
// import { Input } from '../../../components/ui/Input';

// export default function RegisterPage() {
//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

//             {/* Logo */}
//             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
//                 <span className="text-xl font-black text-[#1e40af]">D</span>
//             </div>

//             {/* Header */}
//             <div className="text-center mb-8">
//                 <h1 className="text-2xl font-black text-[#020617] mb-2 tracking-tight">
//                     Create Account
//                 </h1>
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Unlock powerful list of colleges
//                 </p>
//             </div>

//             {/* Register Card */}
//             <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8">

//                 <form className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                                 First Name
//                             </label>
//                             <Input
//                                 placeholder="Rahul"
//                                 className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                                 Last Name
//                             </label>
//                             <Input
//                                 placeholder="Patil"
//                                 className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                             Mobile Number
//                         </label>
//                         <Input
//                             type="tel"
//                             placeholder="+91 98765 43210"
//                             className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                             Email Address
//                         </label>
//                         <Input
//                             type="email"
//                             placeholder="rahul@example.com"
//                             className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                             Create Password
//                         </label>
//                         <Input
//                             type="password"
//                             placeholder="••••••••"
//                             className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
//                         />
//                     </div>

//                     <div className="pt-2">
//                         <Link href="/?login=true" className="block w-full">
//                             <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
//                                 Register & Unlock
//                             </Button>
//                         </Link>
//                     </div>
//                 </form>

//                 {/* Footer Login Link */}
//                 <div className="mt-8 text-center">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                         Already have an account?{' '}
//                         <Link href="/login" className="text-[#1e40af] hover:text-[#1e3a8a] ml-1">
//                             Sign In
//                         </Link>
//                     </p>
//                 </div>

//             </div>
//         </div>
//     );
// }




'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {

    // STEP-1: TEMP test signup function
    const testSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: 'testuser1@gmail.com',
            password: 'Test@1234',
        });

        console.log('DATA:', data);
        console.log('ERROR:', error);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Logo */}
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <span className="text-xl font-black text-[#1e40af]">D</span>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-[#020617] mb-2 tracking-tight">
                    Create Account
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Unlock powerful list of colleges
                </p>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8">

                <form className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                First Name
                            </label>
                            <Input
                                placeholder="Rahul"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Last Name
                            </label>
                            <Input
                                placeholder="Patil"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Mobile Number
                        </label>
                        <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            placeholder="rahul@example.com"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Create Password
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    {/* TEMP TEST BUTTON */}
                    <div className="pt-2">
                        <Button
                            type="button"
                            onClick={testSignup}
                            className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest"
                        >
                            Register & Unlock
                        </Button>
                    </div>

                </form>

                {/* Footer Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-[#1e40af] hover:text-[#1e3a8a] ml-1"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

