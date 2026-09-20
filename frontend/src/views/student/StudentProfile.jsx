import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import {
    getProfileController,
    updateProfileController,
    changePasswordController
} from "../../controllers/authController";

import "../../styles/StudentProfile.css";


const StudentProfile = () => {

    const navigate = useNavigate();

    // ==========================================
    // USER
    // ==========================================

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // PROFILE FORM
    // ==========================================

    const [profileForm, setProfileForm] =
        useState({
            name: "",
            email: ""
        });


    // ==========================================
    // PASSWORD FORM
    // ==========================================

    const [passwordForm, setPasswordForm] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    const [passwordLoading, setPasswordLoading] =
        useState(false);


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {

        const loadProfile = async () => {

            if (!authService.isLoggedIn()) {

                navigate("/login");

                return;
            }

            const result =
                await getProfileController();


            if (!result.success) {

                setError(
                    result.message
                );

                setLoading(false);

                return;
            }

            const currentUser =
                result.data?.data;


            setUser(currentUser);


            setProfileForm({
                name:
                    currentUser?.name || "",

                email:
                    currentUser?.email || ""
            });


            setLoading(false);
        };


        loadProfile();

    }, [navigate]);


    // ==========================================
    // PROFILE INPUT
    // ==========================================

    const handleProfileChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfileForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ==========================================
    // PASSWORD INPUT
    // ==========================================

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPasswordForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        const result =
            await updateProfileController(
                profileForm
            );


        if (!result.success) {

            setError(
                result.message
            );

            return;
        }


        const updatedUser =
            result.data?.data;


        setUser(updatedUser);


        setProfileForm({
            name: updatedUser?.name || "",
            email: updatedUser?.email || ""
        });


        setSuccess(
            "Cập nhật thông tin thành công"
        );
    };


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            passwordForm.newPassword !==
            passwordForm.confirmPassword
        ) {

            setError(
                "Mật khẩu xác nhận không khớp"
            );

            return;
        }


        if (
            passwordForm.newPassword.length < 6
        ) {

            setError(
                "Mật khẩu mới phải có ít nhất 6 ký tự"
            );

            return;
        }


        setPasswordLoading(true);


        const result =
            await changePasswordController({

                currentPassword:
                    passwordForm.currentPassword,

                newPassword:
                    passwordForm.newPassword
            });


        setPasswordLoading(false);


        if (!result.success) {

            setError(
                result.message
            );

            return;
        }


        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });


        setSuccess(
            "Đổi mật khẩu thành công"
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="student-profile-loading">
                <div className="student-profile-loading-spinner"></div>

                <p>
                    Đang tải thông tin...
                </p>
            </div>
        );
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="student-profile-page">

            <div className="student-profile-container">

                {/* BACK BUTTON */}

                <button
                    type="button"
                    className="student-profile-back-button"
                    onClick={() =>
                        navigate("/student")
                    }
                >
                    ← Quay lại Dashboard
                </button>


                {/* HEADER */}

                <div className="student-profile-page-header">

                    <div>
                        <p className="student-profile-eyebrow">
                            Tài khoản
                        </p>

                        <h1 className="student-profile-title">
                            Thông tin cá nhân
                        </h1>

                        <p className="student-profile-subtitle">
                            Quản lý thông tin tài khoản và mật khẩu của bạn.
                        </p>
                    </div>

                </div>


                {/* GLOBAL MESSAGES */}

                {error && (

                    <div className="student-profile-message student-profile-message-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="student-profile-message student-profile-message-success">
                        {success}
                    </div>

                )}


                <div className="student-profile-grid">

                    {/* ==================================
                        PROFILE
                    ================================== */}

                    <div className="student-profile-card">

                        <div className="student-profile-card-header">
                            <div>
                                <h2 className="student-profile-card-title">
                                    Hồ sơ của tôi
                                </h2>

                                <p className="student-profile-card-description">
                                    Cập nhật thông tin tài khoản của bạn.
                                </p>
                            </div>
                        </div>


                        <div className="student-profile-user-summary">

                            <div className="student-profile-avatar">

                                {user?.avatar ? (

                                    <img
                                        src={user.avatar}
                                        alt="Avatar"
                                        className="student-profile-avatar-image"
                                    />

                                ) : (

                                    "👤"

                                )}

                            </div>


                            <div className="student-profile-user-info">

                                <h2 className="student-profile-name">
                                    {user?.name}
                                </h2>

                                <span className="student-profile-role">
                                    {user?.role}
                                </span>

                            </div>

                        </div>


                        <form
                            onSubmit={handleUpdateProfile}
                            className="student-profile-form"
                        >

                            <div className="student-profile-form-group">

                                <label
                                    htmlFor="profile-name"
                                    className="student-profile-label"
                                >
                                    Họ tên
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    name="name"
                                    value={profileForm.name}
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="student-profile-input"
                                    required
                                />

                            </div>


                            <div className="student-profile-form-group">

                                <label
                                    htmlFor="profile-email"
                                    className="student-profile-label"
                                >
                                    Email
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    name="email"
                                    value={profileForm.email}
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="student-profile-input"
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="student-profile-primary-button"
                            >
                                Lưu thay đổi
                            </button>

                        </form>

                    </div>


                    {/* ==================================
                        CHANGE PASSWORD
                    ================================== */}

                    <div className="student-profile-card">

                        <div className="student-profile-card-header">
                            <div>
                                <h2 className="student-profile-card-title">
                                    Đổi mật khẩu
                                </h2>

                                <p className="student-profile-card-description">
                                    Sử dụng mật khẩu mới có ít nhất 6 ký tự.
                                </p>
                            </div>
                        </div>


                        <form
                            onSubmit={handleChangePassword}
                            className="student-profile-form"
                        >

                            <div className="student-profile-form-group">

                                <label
                                    htmlFor="current-password"
                                    className="student-profile-label"
                                >
                                    Mật khẩu hiện tại
                                </label>

                                <input
                                    id="current-password"
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passwordForm.currentPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="student-profile-input"
                                    required
                                />

                            </div>


                            <div className="student-profile-form-group">

                                <label
                                    htmlFor="new-password"
                                    className="student-profile-label"
                                >
                                    Mật khẩu mới
                                </label>

                                <input
                                    id="new-password"
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passwordForm.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="student-profile-input"
                                    minLength={6}
                                    required
                                />

                            </div>


                            <div className="student-profile-form-group">

                                <label
                                    htmlFor="confirm-password"
                                    className="student-profile-label"
                                >
                                    Xác nhận mật khẩu mới
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passwordForm.confirmPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="student-profile-input"
                                    minLength={6}
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="student-profile-primary-button"
                            >
                                {passwordLoading
                                    ? "Đang xử lý..."
                                    : "Đổi mật khẩu"}
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default StudentProfile;
