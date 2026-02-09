import React from 'react';

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header Skeleton */}
            <div className="mb-8 space-y-4">
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Filters Skeleton */}
            <div className="mb-8 flex gap-4">
                <div className="h-10 bg-gray-100 rounded-lg w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-1/4 animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4 w-2/3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>
                            <div className="space-y-2 w-full">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-8 bg-gray-100 rounded w-24"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
