import React from 'react';
import Link from 'next/link';
import { ServiceCard } from './ServiceCard';

export const PremiereResources: React.FC = () => {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-[10px] mb-2 block">Everything You Need</span>
                    <h2 className="text-3xl font-black text-[#020617] tracking-tight mb-4">Powerful Resources</h2>
                    <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    <div className="col-span-1">
                        <Link href="/register" className="block h-full">
                            <ServiceCard
                                title="College Lists"
                                description="Access government & private college lists."
                                icon={<span className="text-2xl md:text-3xl">🏛️</span>}
                            />
                        </Link>
                    </div>
                    <div className="col-span-1">
                        <Link href="/register" className="block h-full">
                            <ServiceCard
                                title="Fees Structure"
                                description="Detailed tuition & fees breakdown."
                                icon={<span className="text-2xl md:text-3xl">💰</span>}
                            />
                        </Link>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/register" className="block h-full">
                            <ServiceCard
                                title="Documents"
                                description="Lists tailored to your category."
                                icon={<span className="text-2xl md:text-3xl">📂</span>}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
