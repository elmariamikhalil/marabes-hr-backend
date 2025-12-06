import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import { Course } from "../types";
import { Users, PlayCircle, Plus, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../App";

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await api.getCourses();
    setCourses(c);
    if (user) {
      const e = await api.getEnrollments(user.id);
      setEnrolledIds(new Set(e.map((x: any) => x.courseId)));
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    await api.enrollCourse(user.id, courseId);
    loadData();
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addCourse(newCourse);
    setShowAddCourse(false);
    setNewCourse({ title: "", description: "", imageUrl: "" });
    loadData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`http://localhost:5000/courses/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Training & Courses</h1>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-2 px-4 py-2 bg-mint-600 text-white rounded-lg hover:bg-mint-700"
          >
            <Plus size={18} /> Add Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="h-40 overflow-hidden relative">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="text-white w-12 h-12" />
              </div>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {course.enrolledCount} enrolled
                  </span>
                </div>

                {enrolledIds.has(course.id) ? (
                  <span className="px-3 py-1 bg-mint-100 text-mint-700 text-sm font-medium rounded-full">
                    Enrolled
                  </span>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Course</h2>
              <button onClick={() => setShowAddCourse(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Course Title</label>
                <input
                  required
                  className="input-std"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  placeholder="e.g., Advanced Excel"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  required
                  className="input-std"
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Course description..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Image URL</label>
                <input
                  required
                  className="input-std"
                  value={newCourse.imageUrl}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mint-600 text-white rounded-lg hover:bg-mint-700"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .input-std { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; }
        .input-std:focus { border-color: #14b8a6; }
      `}</style>
    </div>
  );
};

export default Courses;
