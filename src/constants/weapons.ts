import { WeaponClass } from '../types';

export const WEAPON_CLASSES: Record<string, WeaponClass> = {
  'automatic_rifle': {
    name: 'Automatic Rifle',
    color: '#dc2626',
    icon: 'target'
  },
  'bazooka': {
    name: 'Bazooka',
    color: '#b91c1c',
    icon: 'bomb'
  },
  'grenade_launcher': {
    name: 'Grenade Launcher',
    color: '#991b1b',
    icon: 'bomb'
  },
  'handgun': {
    name: 'Handgun',
    color: '#f59e0b',
    icon: 'target'
  },
  'knife': {
    name: 'Knife',
    color: '#d97706',
    icon: 'sword'
  },
  'shotgun': {
    name: 'Shotgun',
    color: '#dc2626',
    icon: 'target'
  },
  'smg': {
    name: 'SMG',
    color: '#b91c1c',
    icon: 'target'
  },
  'sniper': {
    name: 'Sniper Rifle',
    color: '#991b1b',
    icon: 'crosshair'
  },
  'sword': {
    name: 'Sword',
    color: '#b45309',
    icon: 'sword'
  }
};

export const THREAT_LEVELS = {
  low: { color: '#059669', bg: '#d1fae5' },
  medium: { color: '#d97706', bg: '#fef3c7' },
  high: { color: '#dc2626', bg: '#fee2e2' },
  critical: { color: '#991b1b', bg: '#fecaca' }
};