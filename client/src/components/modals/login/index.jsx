import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { switchLoginModalOpen } from "../../../store/slices/loginModalOpenSlice";
import googleicon from "../../../assets/google-color.svg";

const APIURL = import.meta.env.VITE_API_URL;

const LoginModal = ({ onSignUpClick, onForgotPassClick }) => {
    const isOpen = useSelector((state) => state.loginModalOpen);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tab, setTab] = useState("user");

    const { loading, error } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginEvent = async (e) => {
        e.preventDefault();
        let payload = {
            email,
            password,
            isLoggingAsAdmin: tab === "admin",
        };

        try {// FIXME: Reload on clicking the login button
            const result = await dispatch(loginUser(payload)).unwrap();
            if (result) {
                setEmail("");
                setPassword("");
                toast.success(`Welcome Back to Showtime360! (${tab})`);
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            toast.error(`Login failed! ${error}`);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${APIURL}/oauth/google`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-background2 text-primary_text p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 scale-105">
                <h2 className="text-2xl font-montserrat font-bold mb-4">
                    Login
                </h2>
                <div className="flex mb-4">
                    <button
                        className={`w-1/2 py-2 ${
                            tab === "user"
                                ? "bg-highlight text-primary_text"
                                : "bg-gray-300 text-black"
                        }`}
                        onClick={() => setTab("user")}>
                        User Login
                    </button>
                    <button
                        className={`w-1/2 py-2 ${
                            tab === "admin"
                                ? "bg-highlight text-primary_text"
                                : "bg-gray-300 text-black"
                        }`}
                        onClick={() => setTab("admin")}>
                        Admin Login
                    </button>
                </div>
                <form onSubmit={handleLoginEvent}>
                    <div className="mb-4">
                        <label className="block text-secondary_text">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg bg-background1 text-primary_text focus:outline-none focus:ring-2 focus:ring-highlight"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-secondary_text">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg bg-background1 text-primary_text focus:outline-none focus:ring-2 focus:ring-highlight"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onForgotPassClick}
                        className="text-highlight hover:text-highlight_hover underline mt-0 ml-1">
                        Forgot Password?
                    </button>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-primary_text px-4 py-2 rounded mr-2 transition-all duration-300"
                            onClick={() =>
                                dispatch(switchLoginModalOpen(false))
                            }>
                            Cancel
                        </button>
                        {loading ? (
                            <button className="bg-highlight text-primary_text px-4 py-2 rounded cursor-not-allowed transition-all duration-300">
                                Logging in...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-highlight hover:bg-highlight_hover text-primary_text px-4 py-2 rounded transition-all duration-300">
                                Login
                            </button>
                        )}
                    </div>
                    {error && (
                        <div
                            className="alert alert-danger text-red-500 mt-4"
                            role="alert">
                            {error} !
                        </div>
                    )}
                    <div className="mt-4 mb-4 text-center text-secondary_text">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={onSignUpClick}
                            className="text-highlight hover:text-highlight_hover underline">
                            Sign Up Now
                        </button>
                    </div>
                </form>
                <hr />
                <div className="flex justify-around">
                    <button
                        type="button"
                        className="px-4 py-2 mt-4  border flex gap-2 border-secondary_text rounded-lg transition duration-150"
                        onClick={() => handleGoogleLogin()}>
                        <img
                            className="w-6 h-6"
                            src={googleicon}
                            loading="lazy"
                            alt="google logo"
                        />
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
