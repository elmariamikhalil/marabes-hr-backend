// services/api.ts
import axios from 'axios';
import { Course, Employee, TimeOffRequest, UserScore, EvaluationCategory, AttendanceRecord } from '../types';

const API_BASE = 'http://localhost:5000/api'; // adjust to your backend URL

// Courses
export const getCourses = async (): Promise<Course[]> => {
  const res = await axios.get(`${API_BASE}/courses`);
  return res.data;
};

export const getEnrollments = async (userId: string) => {
  const res = await axios.get(`${API_BASE}/enrollments/${userId}`);
  return res.data;
};

export const enrollCourse = async (userId: string, courseId: string) => {
  await axios.post(`${API_BASE}/enroll`, { userId, courseId });
};

// Users / Employees
export const getUsers = async (): Promise<Employee[]> => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
};

export const addUser = async (user: Employee) => axios.post(`${API_BASE}/users`, user);
export const updateUser = async (user: Employee) => axios.put(`${API_BASE}/users/${user.id}`, user);
export const deleteUser = async (id: string) => axios.delete(`${API_BASE}/users/${id}`);

// Time Off
export const getTimeOffRequests = async (): Promise<TimeOffRequest[]> => {
  const res = await axios.get(`${API_BASE}/timeoff`);
  return res.data;
};

export const addTimeOffRequest = async (req: TimeOffRequest) => axios.post(`${API_BASE}/timeoff`, req);
export const updateTimeOffStatus = async (id: string, status: string, note?: string) =>
  axios.put(`${API_BASE}/timeoff/${id}`, { status, note });

// Evaluations
export const getCategories = async (): Promise<EvaluationCategory[]> => {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
};

export const getScores = async (): Promise<UserScore[]> => {
  const res = await axios.get(`${API_BASE}/scores`);
  return res.data;
};

// Attendance
export const getTodayAttendance = async (userId: string): Promise<AttendanceRecord> => {
  const res = await axios.get(`${API_BASE}/attendance/${userId}/today`);
  return res.data;
};

export const clockIn = async (userId: string) => axios.post(`${API_BASE}/attendance/${userId}/clockin`);
export const clockOut = async (userId: string) => axios.post(`${API_BASE}/attendance/${userId}/clockout`);
