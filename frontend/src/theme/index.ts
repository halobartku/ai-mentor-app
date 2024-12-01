export const theme = {
  colors: {
    // Primary colors
    primary: '#007AFF', // iOS blue
    secondary: '#5856D6', // iOS purple
    success: '#34C759', // iOS green
    danger: '#FF3B30',  // iOS red
    warning: '#FF9500', // iOS orange
    info: '#5856D6',    // iOS purple
    
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
      elevated: '#FFFFFF'
    },
    
    // Text colors
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#787880',
      inverse: '#FFFFFF'
    },
    
    // Special colors
    separator: 'rgba(60, 60, 67, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography: {
    // Font families
    fontFamily: {
      ios: '-apple-system, SF Pro Text',
      display: 'SF Pro Display',
      mono: 'SF Mono'
    },
    
    // Font sizes
    sizes: {
      largeTitle: 34,
      title1: 28,
      title2: 22,
      title3: 20,
      headline: 17,
      body: 17,
      callout: 16,
      subhead: 15,
      footnote: 13,
      caption1: 12,
      caption2: 11
    },
    
    // Font weights
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    
    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.375,
      relaxed: 1.5
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    }
  },
  
  animation: {
    durations: {
      fast: 200,
      normal: 300,
      slow: 450
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  }
};

export type Theme = typeof theme;
