export interface TripInput {
  destination: string;
  duration: number;
  travelers: string;
  budget: string;
  interests: string[];
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  location: string;
  address: string;
  transport: string;
  costEstimate?: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface ItineraryData {
  tripTitle: string;
  summary: string;
  destination: string;
  duration: string;
  budgetEstimate: string;
  days: DayPlan[];
  packingTips: string[];
  localFoodSuggestions: string[];
}

export interface SavedTrip {
  id: string;
  createdAt: number;
  input: TripInput;
  data: ItineraryData;
}

export enum ViewState {
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}