export interface Participant {
  id: string;
  name: string;
  code: string; // Employee ID
  department: string;
  isWinner: boolean;
}

export interface Prize {
  id: string;
  name: string; // e.g., "First Prize"
  count: number; // Total number of items
  drawnCount: number; // How many already won
  image?: string; // URL for prize image
  description?: string;
}

export interface Winner {
  id: string;
  participantId: string;
  prizeId: string;
  timestamp: number;
}

export interface SiteConfig {
  logoUrl?: string;
  brandName: string;
  eventName: string;
}

export interface AppState {
  participants: Participant[];
  prizes: Prize[];
  winners: Winner[];
  siteConfig: SiteConfig;
}

export type PageView = 'lottery' | 'participants' | 'prizes' | 'history' | 'settings';