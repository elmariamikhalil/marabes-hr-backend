import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import { Course } from "../types";
import { Users, Clock, PlayCircle } from "lucide-react";
import { useAuth } from "../App";

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await db.getCourses();
    setCourses(c);
    if (user) {
      const e = await db.getEnrollments(user.id);
      setEnrolledIds(new Set(e.map((x) => x.courseId)));
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    await db.enrollCourse(user.id, courseId);
    loadData(); // Refresh counts and status
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Training & Courses</h1>

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
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-[-8px]">
                  <img
                    src="https://picsum.photos/30?random=1"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://picsum.photos/30?random=2"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://picsum.photos/30?random=3"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    +{course.enrolledCount}
                  </div>
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
    </div>
  );
};

export default Courses;
