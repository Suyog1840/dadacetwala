import React from 'react';

export default function Loading() {
    return (
        <div className="container mx-auto p-4 sm:p-6">
            {/* Title Skeleton */}
            <div className="flex justify-center mb-8">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse w-full"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
                        <div className="h-32 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            <div className="pt-4 flex justify-between items-center">
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-100 rounded w-8"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
