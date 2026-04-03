import { SmartPredictor } from '@/components/features/SmartPredictor';
import Link from 'next/link';

export default function PredictorPage() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            <SmartPredictor />
        </>
    );
}
