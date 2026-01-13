import { AppState, Participant, Prize, Winner, SiteConfig } from '../types';

const STORAGE_KEY = 'cypresstel_lottery_data_v1';

const INITIAL_STATE: AppState = {
  participants: [],
  prizes: [
    { id: '1', name: '特等奖', count: 1, drawnCount: 0, description: '神秘大奖', image: 'https://picsum.photos/400/400?random=1' },
    { id: '2', name: '一等奖', count: 3, drawnCount: 0, description: '新款智能手机', image: 'https://picsum.photos/400/400?random=2' },
    { id: '3', name: '二等奖', count: 10, drawnCount: 0, description: '降噪耳机', image: 'https://picsum.photos/400/400?random=3' },
  ],
  winners: [],
  siteConfig: {
    brandName: 'CYPRESSTEL',
    eventName: 'Annual Gala 2025',
    logoUrl: ''
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(serializedState);
    // Ensure siteConfig and eventName exists for backward compatibility
    if (!parsed.siteConfig) {
      parsed.siteConfig = INITIAL_STATE.siteConfig;
    } else if (!parsed.siteConfig.eventName) {
      parsed.siteConfig.eventName = INITIAL_STATE.siteConfig.eventName;
    }
    return parsed;
  } catch (err) {
    console.error('Could not load state', err);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);