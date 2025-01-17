import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrSecure } from "react-icons/gr";
import { MdOutlineMail } from "react-icons/md";
import useDispatch from "@hooks/use-dispatch";
import SpinnerLoading from "@components/loading/SpinnerLoading";
import { getSession, signIn } from "next-auth/react";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import user from "@services/user";
import { ForgotPasswordState } from "@models/user";
import { toastError } from "@utils/global";
import { toast } from "react-toastify";

const LoginSection: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLoginWithEmailPassword = async (e?: any) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      if (!username || !password) {
        setError("Please fill out username and password!");
        setIsLoading(false);
        return;
      }

      const response = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });

      const session = await getSession();

      if (response?.error) {
        return message.error("Wrong login information!", 1.5);
      } else {
        message.success("Login successfully", 1.5);

        if (session?.user?.role_id === 1) {
          return router.push("/account");
        } else if (session?.user?.role_id === 0) {
          return router.push("/admin/manage-user");
        }
      }
    } catch (error) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        message.error("Please enter your email!");
        return;
      }

      const data: ForgotPasswordState = {
        email: email,
      };

      const response = await user.forgotPassword(data);

      toast.success(response.message);
      setNewPassword(response.new_password);
      setIsForgotModalOpen(false);
    } catch (error: any) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container login-section">
      <div className="left">
        <img src="/images/login-img.jpg" alt={"login-img"} loading="lazy" />
      </div>

      <div className="right">
        <div className="content">
          <h1 className="font-semibold text-center">Welcome back</h1>
          <p className="text-center font-medium mt-2">
            Sign in for the full experience
          </p>
          <div
            aria-disabled={isLoading}
            className="mt-7 btn-login-gg flex items-center justify-center gap-2"
            onClick={() => {}}
          >
            <FcGoogle /> <span className="font-medium">Sign in với Google</span>
          </div>

          <div className="line-text font-medium my-7">Or</div>

          {newPassword && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">
                Your new password is:
              </p>
              <p className="text-green-600 font-bold mt-1">{newPassword}</p>
              <p className="text-green-700 text-sm mt-2">
                Please use this password to login and change it after logging
                in.
              </p>
            </div>
          )}

          <form onSubmit={handleLoginWithEmailPassword}>
            <div className="input-field relative">
              <input
                type="text"
                required
                placeholder="Enter username"
                className="font-semibold text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="absolute left-3 w-6 h-6 opacity-30">
                <MdOutlineMail />
              </div>
            </div>

            <div className="input-field relative mt-6">
              <input
                type="password"
                required
                placeholder="Enter password"
                className="font-semibold text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute left-3 w-6 h-6 opacity-30">
                <GrSecure />
              </div>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <div className="my-6 flex flex-row items-center justify-between">
              <div>
                <input
                  type="checkbox"
                  id="forgot-checkbox"
                  className="cursor-pointer"
                />
                <label
                  htmlFor="forgot-checkbox"
                  className="cursor-pointer font-semibold ml-2"
                >
                  Remember
                </label>
              </div>
              <p
                className="forgot font-semibold cursor-pointer"
                onClick={() => setIsForgotModalOpen(true)}
              >
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              className="btn-action-login-register text-center text-lg cursor-pointer"
              disabled={isLoading}
            >
              Sign in
            </button>
          </form>

          <p className="text-center mt-6 text-register font-semibold">
            Not a member yet?{" "}
            <span
              onClick={() => router.push("/register")}
              className="font-normal"
            >
              Lets register an account
            </span>
          </p>
        </div>
      </div>

      {isForgotModalOpen && (
        <Modal
          title="Forgot Password"
          open={isForgotModalOpen}
          onOk={handleForgotPassword}
          onCancel={() => setIsForgotModalOpen(false)}
          confirmLoading={isLoading}
        >
          <div className="mt-4">
            <p className="mb-2">Please enter your email address:</p>
            <input
              type="email"
              className="p-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "96%" }}
            />
          </div>
        </Modal>
      )}

      {isLoading && <SpinnerLoading />}
    </div>
  );
};

export default LoginSection;
