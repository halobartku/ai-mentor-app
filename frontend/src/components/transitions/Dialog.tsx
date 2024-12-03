"use client";

import React, { useEffect } from 'react';

interface DialogProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  position?: 'center' | 'bottom';
}

export function Dialog({ 
  children, 
  isVisible, 
  onClose, 
  position = 'center' 
}: DialogProps) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div
        className={`
          relative w-full max-w-lg transform overflow-hidden bg-white
          transition-all duration-200 ease-out
          ${position === 'center' ? 'rounded-xl mx-4' : 'rounded-t-xl mt-auto'}
        `}
      >
        {children}
      </div>
    </div>
  );
}