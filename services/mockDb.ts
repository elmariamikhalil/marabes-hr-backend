import { Employee, TimeOffRequest, Course, UserScore, EvaluationCategory, Enrollment, AttendanceRecord } from '../types';

// --- SEED DATA ---

const users: Employee[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@marabes.com',
    role: 'ADMIN',
    avatarUrl: 'https://picsum.photos/id/1/200/200',
    jobPosition: 'HR Manager',
    birthday: '1985-05-15',
    dateHired: '2015-01-10',
    phone: '+1 555 0101',
    address: '123 Mint St, Tech City',
    department: 'Human Resources'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@marabes.com',
    role: 'EMPLOYEE',
    avatarUrl: 'https://picsum.photos/id/2/200/200',
    jobPosition: 'Senior Accountant',
    birthday: '1990-08-22',
    dateHired: '2018-03-15',
    phone: '+1 555 0102',
    address: '456 Oak Ave',
    department: 'Finance'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@marabes.com',
    role: 'EMPLOYEE',
    avatarUrl: 'https://picsum.photos/id/3/200/200',
    jobPosition: 'Junior Developer',
    birthday: '1995-11-30',
    dateHired: '2021-06-01',
    phone: '+1 555 0103',
    address: '789 Pine Rd',
    department: 'IT'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@marabes.com',
    role: 'EMPLOYEE',
    avatarUrl: 'https://picsum.photos/id/4/200/200',
    jobPosition: 'Bookkeeper',
    birthday: '1992-02-14',
    dateHired: '2019-11-20',
    phone: '+1 555 0104',
    address: '321 Elm St',
    department: 'Finance'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@marabes.com',
    role: 'EMPLOYEE',
    avatarUrl: 'https://picsum.photos/id/5/200/200',
    jobPosition: 'Analyst',
    birthday: '1988-07-04',
    dateHired: '2020-01-15',
    phone: '+1 555 0105',
    address: '654 Maple Dr',
    department: 'Analytics'
  }
];

const timeOffRequests: TimeOffRequest[] = [
  {
    id: '101',
    userId: '2',
    userName: 'Sarah Johnson',
    type: 'Vacation',
    startDate: '2023-11-01',
    endDate: '2023-11-05',
    status: 'APPROVED',
    reason: 'Family trip',
    adminNote: 'Enjoy your trip!'
  },
  {
    id: '102',
    userId: '3',
    userName: 'Mike Chen',
    type: 'Sick',
    startDate: '2023-10-15',
    endDate: '2023-10-16',
    status: 'PENDING',
    reason: 'Flu'
  }
];

const categories: EvaluationCategory[] = [
  { id: 'c1', name: 'Bookkeeping' },
  { id: 'c2', name: 'VAT' },
  { id: 'c3', name: 'Toolbox' },
  { id: 'c4', name: 'Yearwork' }
];

const scores: UserScore[] = [
  { id: 's1', userId: '2', userName: 'Sarah Johnson', categoryId: 'c1', score: 85, date: '2023-09-01' }, // High
  { id: 's2', userId: '2', userName: 'Sarah Johnson', categoryId: 'c2', score: 92, date: '2023-09-01' }, // High
  { id: 's3', userId: '3', userName: 'Mike Chen', categoryId: 'c1', score: 45, date: '2023-09-01' }, // Low
  { id: 's4', userId: '3', userName: 'Mike Chen', categoryId: 'c3', score: 65, date: '2023-09-01' }, // Med
  { id: 's5', userId: '4', userName: 'Emily Davis', categoryId: 'c1', score: 75, date: '2023-09-01' }, // Med-High
  { id: 's6', userId: '4', userName: 'Emily Davis', categoryId: 'c2', score: 25, date: '2023-09-01' }, // Fail
  { id: 's7', userId: '5', userName: 'David Wilson', categoryId: 'c4', score: 55, date: '2023-09-01' }  // Med
];

const courses: Course[] = [
  {
    id: 'cr1',
    title: 'Advanced Excel',
    description: 'Master pivot tables, macros, and complex formulas.',
    imageUrl: 'https://picsum.photos/id/10/400/200',
    enrolledCount: 12
  },
  {
    id: 'cr2',
    title: 'Workplace Safety',
    description: 'Essential safety protocols for the modern office.',
    imageUrl: 'https://picsum.photos/id/20/400/200',
    enrolledCount: 45
  },
  {
    id: 'cr3',
    title: 'Leadership 101',
    description: 'Developing core management skills.',
    imageUrl: 'https://picsum.photos/id/30/400/200',
    enrolledCount: 8
  }
];

const enrollments: Enrollment[] = [
  { id: 'e1', userId: '2', courseId: 'cr1', dateEnrolled: '2023-01-15' }
];

const attendance: AttendanceRecord[] = [];

// --- SERVICE LAYER ---
// Simulating Async Database calls with Promises

export const db = {
  getUsers: async (): Promise<Employee[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...users]), 300));
  },

  getUserByEmail: async (email: string): Promise<Employee | undefined> => {
     return new Promise(resolve => setTimeout(() => resolve(users.find(u => u.email === email)), 300));
  },

  addUser: async (user: Omit<Employee, 'id'>) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (updatedUser: Employee) => {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) users[index] = updatedUser;
    return updatedUser;
  },

  deleteUser: async (id: string) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) users.splice(index, 1);
  },

  getTimeOffRequests: async () => {
    return new Promise<TimeOffRequest[]>(resolve => setTimeout(() => resolve([...timeOffRequests]), 300));
  },

  addTimeOffRequest: async (req: Omit<TimeOffRequest, 'id' | 'status'>) => {
    const newReq: TimeOffRequest = { ...req, id: Math.random().toString(36).substr(2, 9), status: 'PENDING' };
    timeOffRequests.push(newReq);
    return newReq;
  },

  updateTimeOffStatus: async (id: string, status: 'APPROVED' | 'REJECTED', adminNote?: string) => {
    const req = timeOffRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (adminNote) req.adminNote = adminNote;
    }
    return req;
  },

  getCategories: async () => [...categories],

  getScores: async () => [...scores],

  addScore: async (score: Omit<UserScore, 'id'>) => {
    const newScore = { ...score, id: Math.random().toString(36).substr(2, 9) };
    scores.push(newScore);
    return newScore;
  },

  getCourses: async () => [...courses],
  
  enrollCourse: async (userId: string, courseId: string) => {
    const enrollment = { id: Math.random().toString(), userId, courseId, dateEnrolled: new Date().toISOString() };
    enrollments.push(enrollment);
    
    // Update count in mock
    const course = courses.find(c => c.id === courseId);
    if(course) course.enrolledCount++;
    
    return enrollment;
  },

  getEnrollments: async (userId: string) => enrollments.filter(e => e.userId === userId),

  // Attendance (Fingerprint)
  getTodayAttendance: async (userId: string): Promise<AttendanceRecord | undefined> => {
    const today = new Date().toISOString().split('T')[0];
    return new Promise(resolve => setTimeout(() => resolve(attendance.find(a => a.userId === userId && a.date === today)), 200));
  },

  clockIn: async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      date: today,
      clockInTime: new Date().toISOString(),
      status: 'CLOCKED_IN'
    };
    attendance.push(record);
    return record;
  },

  clockOut: async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.userId === userId && a.date === today);
    if (record) {
      record.clockOutTime = new Date().toISOString();
      record.status = 'CLOCKED_OUT';
    }
    return record;
  }
};