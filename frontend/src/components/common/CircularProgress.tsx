"use client";

import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 40,
  strokeWidth = 4,
  color = '#007AFF'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="opacity-20"
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          className="transition-all duration-500 ease-in-out"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium"
        style={{ color }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}