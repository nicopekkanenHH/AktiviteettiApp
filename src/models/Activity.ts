export interface Activity {
    id: string;
    name: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
    };
    time: string; // ISO-string tai Date
    category: string;
    creatorId: string;
    participants: string[];
  }