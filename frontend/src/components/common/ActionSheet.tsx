"use client";

import React from 'react';

interface ActionSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  options: ActionSheetOption[];
}

export function ActionSheet({ isOpen, onClose, options }: ActionSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onPress();
                onClose();
              }}
              className={`w-full px-4 py-3 text-left text-sm border-b border-gray-200 last:border-0 ${option.destructive ? 'text-red-600' : 'text-gray-900'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-sm font-medium text-blue-600 border-t border-gray-200 bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}