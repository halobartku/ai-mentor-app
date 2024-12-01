import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const getTimeAgo = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (deadline: string | Date): boolean => {
  return isBefore(new Date(deadline), new Date());
};

export const isUpcoming = (date: string | Date, days: number = 7): boolean => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return isAfter(new Date(date), new Date()) && isBefore(new Date(date), futureDate);
};