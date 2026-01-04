'use client';
import React, { useState } from 'react';

const faqs = [
    {
        question: "What is the benefit of premium counseling?",
        answer: "Premium counseling provides you with a dedicated personal mentor, 24/7 support throughout the admission process, AI-driven college prediction, and a customized preference list strategy to maximize your chances of getting into your dream college."
    },
    {
        question: "How accurate is the college predictor?",
        answer: "Our predictor analyses the last 5 years of CAP round cutoffs, seat matrices, and category-wise trends. It has historically maintained an accuracy rate of over 95% for top colleges."
    },
    {
        question: "Can I get guidance for medical courses too?",
        answer: "Yes, absolutely! We specialize in both Engineering (MHTCET) and Medical (NEET) admission counseling. We have successfully placed over 3,000 students in medical colleges last year."
    },
    {
        question: "What documents are required for CAP registration?",
        answer: "Key documents include your MHTCET/NEET Scorecard, HSC & SSC Marksheets, Domicile Certificate, Nationality Certificate, and category-specific documents like Caste Validity and Non-Creamy Layer certificates."
    }
];

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-10 bg-white">
            <div className="max-w-3xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black text-[#020617] tracking-tight mb-4">Frequently Asked Questions</h2>
                    <div className="w-12 h-1 bg-[#1e40af] rounded-full mx-auto"></div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border border-gray-100 rounded-2xl transition-all duration-300 ${openIndex === index ? 'bg-gray-50 shadow-md shadow-blue-50/50 border-blue-100' : 'bg-white hover:border-gray-200'}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                            >
                                <span className={`text-sm md:text-base font-bold ${openIndex === index ? 'text-[#1e40af]' : 'text-[#020617]'}`}>
                                    {faq.question}
                                </span>
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </span>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}>
                                <div className="p-5 pt-0 text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
