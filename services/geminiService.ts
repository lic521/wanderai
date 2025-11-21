import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryData, TripInput } from "../types";

const activitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    time: { type: Type.STRING, description: "Time of day, e.g., '09:00'" },
    activity: { type: Type.STRING, description: "Name of the activity" },
    description: { type: Type.STRING, description: "Concise description of what to do" },
    location: { type: Type.STRING, description: "Name of the specific place/venue" },
    address: { type: Type.STRING, description: "Real, specific street address in Chinese/Local language" },
    transport: { type: Type.STRING, description: "Specific transport instruction from previous spot (e.g. '乘坐地铁1号线至XX站B口出，步行5分钟')" },
    costEstimate: { type: Type.STRING, description: "Estimated cost" }
  },
  required: ["time", "activity", "description", "location", "address", "transport"]
};

const daySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER },
    theme: { type: Type.STRING, description: "A short theme for the day" },
    activities: {
      type: Type.ARRAY,
      items: activitySchema
    }
  },
  required: ["dayNumber", "theme", "activities"]
};

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING },
    summary: { type: Type.STRING },
    destination: { type: Type.STRING },
    duration: { type: Type.STRING },
    budgetEstimate: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: daySchema
    },
    packingTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    localFoodSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["tripTitle", "summary", "destination", "days", "packingTips"]
};

function cleanJsonString(text: string): string {
  let cleanText = text.trim();
  // Remove markdown code blocks if present
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "");
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```/, "").replace(/```$/, "");
  }
  return cleanText.trim();
}

export const generateItinerary = async (input: TripInput): Promise<ItineraryData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    请为我去 ${input.destination} 的旅行规划一个详细的行程。
    时长：${input.duration} 天。
    旅行者：${input.travelers}。
    预算等级：${input.budget}。
    兴趣偏好：${input.interests.join(", ") || "一般观光"}。
    
    要求：
    1. 必须包含具体的 **真实地址** (address)。
    2. 必须包含详细的 **交通方案** (transport)：如何从上一个地点到达当前地点（例如：乘坐地铁X号线，公交Y路，或打车约Z元）。第一个活动假定从酒店出发。
    3. 行程要合逻辑，路线要顺畅。
    4. 请务必使用简体中文 (Simplified Chinese) 回复。
    
    Ensure the response is valid JSON matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const cleanedText = cleanJsonString(text);
    return JSON.parse(cleanedText) as ItineraryData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Re-throw with a more user-friendly message if possible, or the original error
    throw new Error(error.message || "Failed to generate itinerary");
  }
};