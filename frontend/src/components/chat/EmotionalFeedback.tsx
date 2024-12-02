import React from 'react';
import { EmotionalState } from '@/types/chat';

interface EmotionalFeedbackProps {
  emotionalState: EmotionalState;
  className?: string;
}

export function EmotionalFeedback({ emotionalState, className = '' }: EmotionalFeedbackProps) {
  const getEmotionColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex gap-2 p-2 rounded-lg bg-gray-50 ${className}`}>
      <div className="flex flex-col items-center">
        <div className={`w-2 h-16 rounded-full ${getEmotionColor(emotionalState.currentMood)}`} 
             style={{ height: `${emotionalState.currentMood * 100}%` }} />
        <span className="text-xs mt-1">Mood</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className={`w-2 h-16 rounded-full ${getEmotionColor(1 - emotionalState.stressLevel)}`}
             style={{ height: `${(1 - emotionalState.stressLevel) * 100}%` }} />
        <span className="text-xs mt-1">Calm</span>
      </div>

      <div className="flex flex-col items-center">
        <div className={`w-2 h-16 rounded-full ${getEmotionColor(emotionalState.engagementScore)}`}
             style={{ height: `${emotionalState.engagementScore * 100}%` }} />
        <span className="text-xs mt-1">Focus</span>
      </div>

      <div className="flex flex-col items-center">
        <div className={`w-2 h-16 rounded-full ${getEmotionColor(emotionalState.confidenceLevel)}`}
             style={{ height: `${emotionalState.confidenceLevel * 100}%` }} />
        <span className="text-xs mt-1">Confidence</span>
      </div>
    </div>
  );
}