export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5856D6',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#3C3C43',
    border: '#C6C6C8'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    h1: {
      fontSize: 34,
      fontWeight: 'bold'
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold'
    },
    h3: {
      fontSize: 22,
      fontWeight: 'bold'
    },
    body: {
      fontSize: 17
    },
    caption: {
      fontSize: 13
    }
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  }
};

export type Theme = typeof theme;
