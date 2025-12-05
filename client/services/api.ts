import axios from "axios";
import {
  Course,
  Employee,
  TimeOffRequest,
  UserScore,
  EvaluationCategory,
  AttendanceRecord,
} from "../types";

const API_BASE = "http://localhost:5000";

// Users
export const getUsers = async (): Promise<Employee[]> => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
};

export const getUserByEmail = async (
  email: string
): Promise<Employee | undefined> => {
  const users = await getUsers();
  return users.find((u) => u.email === email);
};

export const addUser = async (user: Omit<Employee, "id">) => {
  const res = await axios.post(`${API_BASE}/users`, user);
  return res.data;
};

export const updateUser = async (user: Employee) => {
  const res = await axios.put(`${API_BASE}/users/${user.id}`, user);
  return res.data;
};

export const deleteUser = async (id: string) => {
  await axios.delete(`${API_BASE}/users/${id}`);
};

// Time Off
export const getTimeOffRequests = async (): Promise<TimeOffRequest[]> => {
  const res = await axios.get(`${API_BASE}/timeoff`);
  return res.data;
};

export const addTimeOffRequest = async (
  req: Omit<TimeOffRequest, "id" | "status">
) => {
  const res = await axios.post(`${API_BASE}/timeoff`, req);
  return res.data;
};

export const updateTimeOffStatus = async (
  id: string,
  status: string,
  note?: string
) => {
  const res = await axios.put(`${API_BASE}/timeoff/${id}`, { status, note });
  return res.data;
};

// Categories
export const getCategories = async (): Promise<EvaluationCategory[]> => {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
};

// Scores
export const getScores = async (): Promise<UserScore[]> => {
  const res = await axios.get(`${API_BASE}/scores`);
  return res.data;
};

export const addScore = async (score: Omit<UserScore, "id">) => {
  const res = await axios.post(`${API_BASE}/scores`, score);
  return res.data;
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  const res = await axios.get(`${API_BASE}/courses`);
  return res.data;
};

// Enrollments
export const getEnrollments = async (userId: string) => {
  const res = await axios.get(`${API_BASE}/enrollments/${userId}`);
  return res.data;
};

export const enrollCourse = async (userId: string, courseId: string) => {
  const res = await axios.post(`${API_BASE}/enrollments`, { userId, courseId });
  return res.data;
};

// Attendance
export const getTodayAttendance = async (
  userId: string
): Promise<AttendanceRecord | null> => {
  const res = await axios.get(`${API_BASE}/attendance/${userId}/today`);
  return res.data;
};

export const clockIn = async (userId: string) => {
  const res = await axios.post(`${API_BASE}/attendance/${userId}/clockin`);
  return res.data;
};

export const clockOut = async (userId: string) => {
  const res = await axios.post(`${API_BASE}/attendance/${userId}/clockout`);
  return res.data;
};
