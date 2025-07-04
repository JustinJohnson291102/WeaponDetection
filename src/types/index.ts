export interface Detection {
  id: string;
  timestamp: string;
  filename: string;
  detectedClasses: DetectedClass[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  imageUrl: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface DetectedClass {
  class: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AlertStats {
  total: number;
  today: number;
  thisWeek: number;
  critical: number;
}

export interface WeaponClass {
  name: string;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  read: boolean;
}