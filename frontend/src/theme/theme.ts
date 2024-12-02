export const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textLight: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    aiMessage: '#F2F2F7',
    userMessage: '#007AFF',
    aiMessageText: '#000000',
    userMessageText: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputField: '#F2F2F7',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 34,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 22,
      fontWeight: 'semibold',
    },
    body: {
      fontSize: 17,
      fontWeight: 'regular',
    },
    caption: {
      fontSize: 13,
      fontWeight: 'regular',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textLight: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    aiMessage: '#1C1C1E',
    userMessage: '#0A84FF',
    aiMessageText: '#FFFFFF',
    userMessageText: '#FFFFFF',
    inputBackground: '#1C1C1E',
    inputField: '#2C2C2E',
  },
  ...lightTheme.spacing,
  ...lightTheme.borderRadius,
  ...lightTheme.typography,
  ...lightTheme.shadows,
};

export type Theme = typeof lightTheme;
