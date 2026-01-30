// src/pages/Auth/SignInPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setIsAuthenticated, setUser } from "../../redux/slices/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { useLoginMutation } from "../../redux/api/authApi";

type LoginFormData = {
  username: string;
  password: string;
};

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        username: data.username,
        password: data.password,
      }).unwrap();

      // Store user data in Redux
      dispatch(
        setUser({
          username: response.username,
          email: response.email || "",
          role: response.role,
          employeeId: response.employeeId,
        }),
      );
      dispatch(setIsAuthenticated(true));

      // Navigate to home
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <AuthLayout title="Welcome Back!">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome Back!">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Show small spinner during submission */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-700"></div>
          </div>
        )}

        {/* Show error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {"data" in error && typeof error.data === "string"
              ? error.data
              : "Login failed. Please check your credentials."}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* User Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Name:
            </label>
            <input
              type="text"
              {...register("username", {
                required: "User Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                ${errors.username ? "border-red-500" : ""}`}
              placeholder=""
              disabled={isLoading}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 4, message: "Minimum 4 characters" },
              })}
              className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                ${errors.password ? "border-red-500" : ""}`}
              placeholder=""
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot PIN Link */}
          <div className="text-right mb-6">
            <a href="#" className="text-sm text-teal-600 hover:text-teal-700">
              Forgot PIN?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login Now"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
