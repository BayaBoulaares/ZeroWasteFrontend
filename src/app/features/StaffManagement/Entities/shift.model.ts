export interface Shift {
    idShift?: number;  // Optional when creating
    date: string;      // 'YYYY-MM-DD'
    startTime: string; // 'HH:MM:SS'
    endTime: string;   // 'HH:MM:SS'
    employee?: any;    // Optional employee object or ID
  }