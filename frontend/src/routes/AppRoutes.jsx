import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../views/auth/Login";
import Register from "../views/auth/Register";

import Navbar from "../components/Navbar";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import StudentDashboard
    from "../views/student/StudentDashboard";

import TeacherDashboard
    from "../views/teacher/TeacherDashboard";

import AdminDashboard
    from "../views/admin/AdminDashboard";

import CourseList
    from "../views/course/CourseList";

import CourseDetail
    from "../views/course/CourseDetail";

import MyCourses
    from "../views/student/MyCourses";

import LearningPage
    from "../views/learning/LearningPage";

import TeacherCourseList
    from "../views/teacher/TeacherCourseList";

import TeacherCourseCreate
    from "../views/teacher/TeacherCourseCreate";

import TeacherLessonManagement
    from "../views/teacher/TeacherLessonManagement";

import TeacherCourseEdit
    from "../views/teacher/TeacherCourseEdit";
import StudentProfile
    from "../views/student/StudentProfile";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* ========================= */}
                {/* PUBLIC */}
                {/* ========================= */}

                <Route
                    path="/"
                    element={
                        <div style={{ padding: "40px" }}>
                            <h1>
                                Trang chủ E-Learning
                            </h1>

                            <p>
                                Nền tảng học trực tuyến
                            </p>
                        </div>
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/courses"
                    element={<CourseList />}
                />

                <Route
                    path="/courses/:id"
                    element={<CourseDetail />}
                />

                {/* ========================= */}
                {/* PROTECTED */}
                {/* ========================= */}

                <Route element={<ProtectedRoute />}>

                    {/* STUDENT */}

                    <Route element={
                        <RoleRoute
                            allowedRoles={["student"]}
                        />
                    }>
                         <Route
                            path="/student/profile"
                            element={<StudentProfile />}
                        />

                        <Route
                            path="/student"
                            element={
                                <StudentDashboard />
                            }
                        />

                        <Route
                            path="/my-courses"
                            element={
                                <MyCourses />
                            }
                        />

                        <Route
                            path="/learning/:courseId"
                            element={
                                <LearningPage />
                            }
                        />

                       

                    </Route>


                    {/* TEACHER */}

                    <Route element={
                        <RoleRoute
                            allowedRoles={["teacher"]}
                        />
                    }>

                        <Route
                            path="/teacher"
                            element={
                                <TeacherDashboard />
                            }
                        />

                        <Route
                            path="/teacher/courses"
                            element={
                                <TeacherCourseList />
                            }
                        />

                        <Route
                            path="/teacher/courses/create"
                            element={
                                <TeacherCourseCreate />
                            }
                        />

                        <Route
                            path="/teacher/courses/edit/:courseId"
                            element={
                                <TeacherCourseEdit />
                            }
                        />

                        <Route
                            path="/teacher/courses/:courseId/lessons"
                            element={
                                <TeacherLessonManagement />
                            }
                        />



                    </Route>


                    {/* ADMIN */}

                    <Route element={
                        <RoleRoute
                            allowedRoles={["admin"]}
                        />
                    }>

                        <Route
                            path="/admin"
                            element={
                                <AdminDashboard />
                            }
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;