// src/models/Activity.ts
export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  time: string; // ISO string
  location: {
    latitude: number;
    longitude: number;
  };
  // ei kirjautumista → creatorId on valinnainen
  creatorId?: string;
  participants: string[];
}


