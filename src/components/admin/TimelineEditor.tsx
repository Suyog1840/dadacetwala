import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';
import { getTimelineEvents, syncTimelineEvents } from '@/actions/timeline';

interface TimelineStep {
    id: string | number; // allow number for initial state
    title: string;
    status: 'completed' | 'current' | 'upcoming';
    date: string; // "Aug 10" format for display
    startDate?: string; // Real ISO for DB
    endDate?: string; // Real ISO for DB
}

const DEFAULT_STEPS: TimelineStep[] = [
    { id: 1, title: "Registration", status: "completed", date: "Aug 10" },
    { id: 2, title: "Doc Verification", status: "current", date: "Aug 14" },
    { id: 3, title: "Merit List", status: "upcoming", date: "Aug 22" },
    { id: 4, title: "Option Entry", status: "upcoming", date: "Aug 25" },
    { id: 5, title: "Seat Allotment", status: "upcoming", date: "Sept 01" }
];

export const TimelineEditor = () => {
    const [steps, setSteps] = useState<TimelineStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        const data = await getTimelineEvents();
        if (data && data.length > 0) {
            // Map DB events to UI format
            const mappedSteps = data.map((e: any) => ({
                id: e.id,
                title: e.title,
                status: e.status,
                // Format date as "MMM dd"
                date: new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                startDate: e.startDate,
                endDate: e.endDate
            }));

            // Sort by order/startDate if needed, or rely on backend sort
            // mappedSteps.sort(...) 

            setSteps(mappedSteps);
        } else {
            setSteps([]);
        }
        setLoading(false);
    };

    const handleStepChange = (index: number, field: keyof TimelineStep, value: any) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const handleSave = async () => {
        setSaving(true);

        // Prepare events for DB
        const eventsToSave = steps.map((step, index) => {
            // Parse date string to Date object for DB
            let start = new Date();
            let end = new Date();

            if (step.date) {
                // Try to parse "Aug 10"
                const currentYear = new Date().getFullYear();
                const parsedDate = new Date(`${step.date} ${currentYear}`);
                if (!isNaN(parsedDate.getTime())) {
                    start = parsedDate;
                    end = parsedDate; // Use same date for end if valid
                }
            }

            // If we have preserved full ISO strings, use them
            if (step.startDate) start = new Date(step.startDate);
            if (step.endDate) end = new Date(step.endDate);

            return {
                id: typeof step.id === 'string' && !step.id.startsWith('temp') ? step.id : undefined,
                title: step.title,
                status: step.status,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                order: index
            };
        });

        const res = await syncTimelineEvents(eventsToSave);
        if (res.success) {
            // alert('Timeline updated successfully!');
            await loadEvents(); // Reload to get real IDs
        } else {
            alert('Failed to update timeline: ' + res.error);
        }
        setSaving(false);
    };

    const handleDelete = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    if (loading) return <div className="p-8 text-center text-gray-400 text-xs">Loading steps...</div>;

    return (
        <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <Heading as="h3" className="mb-1">Admission Journey Control</Heading>
                <Subheading>
                    Update live tracking status and schedule.
                </Subheading>
            </div>

            <div className="grid gap-4 mb-8">
                {steps.map((step, index) => (
                    <div key={step.id} className="grid grid-cols-1 md:grid-cols-[40px_1.5fr_1.2fr_1fr_1fr_40px] gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-300">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Step Name</label>
                            <Input
                                value={step.title}
                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                className="bg-white h-9 font-bold text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Live Status</label>
                            <div className="relative">
                                <select
                                    value={step.status}
                                    onChange={(e) => handleStepChange(index, 'status', e.target.value)}
                                    className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs font-black uppercase tracking-wide appearance-none cursor-pointer"
                                    style={{
                                        color: step.status === 'completed' ? '#16a34a' :
                                            step.status === 'current' ? '#1e40af' : '#9ca3af'
                                    }}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="current">Current</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Start Date</label>
                            <Input
                                type="date"
                                value={step.startDate ? new Date(step.startDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                        const date = new Date(val);
                                        if (!isNaN(date.getTime())) {
                                            handleStepChange(index, 'startDate', date.toISOString());
                                            handleStepChange(index, 'date', date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
                                        }
                                    }
                                }}
                                className="bg-white h-9 text-xs font-bold"
                            />
                        </div>

                        <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">End Date</label>
                            <Input
                                type="date"
                                value={step.endDate ? new Date(step.endDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                        const date = new Date(val);
                                        if (!isNaN(date.getTime())) {
                                            handleStepChange(index, 'endDate', date.toISOString());
                                        }
                                    }
                                }}
                                className="bg-white h-9 text-xs font-bold"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => handleDelete(index)}
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-200 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                                title="Remove Step"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    onClick={() => {
                        const newSteps = [...steps, {
                            id: `temp-${Date.now()}`,
                            title: "New Step",
                            status: "upcoming",
                            date: "TBD"
                        } as any];
                        setSteps(newSteps);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-6 h-10 text-[10px] font-black tracking-widest uppercase shadow-none"
                >
                    + Add Step
                </Button>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-8 h-10 text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-900/20 w-48"
                >
                    {saving ? 'Saving...' : 'Publish Journey'}
                </Button>
            </div>

            {steps.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-400 text-xs mt-4">
                    No steps. Add one to start.
                </div>
            )}
        </div>
    );
};
