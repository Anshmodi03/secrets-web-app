import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");
  const email = query.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function resetPassword(data) {
    try {
      const response = await fetch(
        `/api/auth/resetPassword/${email}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.msg === "Password reset successful") {
          toast.success("Password reset successful");
        } else if (result.msg === "User Not Found") {
          toast.error("User not found");
        } else console.log("Success:", result);
      } else {
        toast.error("Wrong token");
        // console.log("Wrong token", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-5 mx-auto bg-white shadow-lg">
        <div className="my-5 space-y-1 ">
          <div className="text-3xl font-bold">Reset Password</div>
          <p className="text-gray-500">
            Please enter your new password and confirm it.
          </p>
        </div>
        <div>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit((data, e) => {
              e.preventDefault();

              resetPassword(data);
            })}
          >
            <div className="space-y-2">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="New Password"
                {...register("newPassword", {
                  required: "New Password is required",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `- at least 8 characters\n
                        - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                        - Can contain special characters`,
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "confirm password is required",
                  validate: (value, formValues) =>
                    value === formValues.newPassword || "password not matching",
                })}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              className="w-full mt-2 bg-[#18181B] hover:bg-[#2c2c31] text-white py-2 rounded-md"
              type="submit"
            >
              Reset Password
            </button>
          </form>
          <div className="my-5 text-center">
            <p className="text-gray-500">
              Remember your password?{" "}
              <Link
                className="text-blue-500 underline hover:text-blue-700"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
