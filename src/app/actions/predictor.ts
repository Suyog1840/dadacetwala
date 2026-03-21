"use server";

export interface PredictorInput {
    scores: {
        MHTCET?: number;
        JEE?: number;
    };
    category: string;
    gender: string;
    homeUniversity: string;
    branchPreference: string[];
    districtPreference: string[];
}

export interface PredictionResult {
    examType: string;
    collegeCode: number;
    collegeName: string;
    branchCode: string;
    branchName: string;
    district: string;
    weighted_cutoff: number;
    standard_cutoff: number;
    probability: number;
}

export interface PredictorResponse {
    success: boolean;
    results?: PredictionResult[];
    error?: string;
}

export async function getPredictions(data: PredictorInput): Promise<PredictorResponse> {
    const apiUrl = process.env.PREDICTION_API_URL;

    if (!apiUrl) {
        return { success: false, error: "Prediction API URL is not configured." };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `API Error: ${response.status} - ${errorText}` };
        }

        const responseData = await response.json();
        return { success: true, results: responseData.results };
    } catch (err: any) {
        return { success: false, error: err.message || "An unexpected error occurred." };
    }
}
