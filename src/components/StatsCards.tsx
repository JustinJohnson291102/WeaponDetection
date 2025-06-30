import React from 'react';
import { AlertTriangle, Shield, Target, TrendingUp } from 'lucide-react';
import { AlertStats } from '../types';

interface StatsCardsProps {
  stats: AlertStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Detections',
      value: stats.total,
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%'
    },
    {
      title: 'Today',
      value: stats.today,
      icon: Shield,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+5%'
    },
    {
      title: 'This Week',
      value: stats.thisWeek,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      change: '+8%'
    },
    {
      title: 'Critical Alerts',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '+2%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">{card.change}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
          <p className="text-gray-600 text-sm">{card.title}</p>
        </div>
      ))}
    </div>
  );
};