"use client";
import { Card, Input } from "antd";
import { CiLock } from "react-icons/ci";
import { BiLogInCircle } from "react-icons/bi";
import { useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../login/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLoginUserMutation } from "../store/services/shifaapi";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const togglepassword = () => {
    setshowpassword(!showpassword);
  };

  const handleLogin = async () => {
    try {
      const result = await loginUser({ identifier, password }).unwrap();
      localStorage.setItem("activeUser", result.user.id);
      localStorage.setItem("token", result.token);

      router.push("/patient/shifa");
    } catch (err: unknown) {
      console.error("Login Error Details:", err);
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message === "string"
          ? (err as { data: { message: string } }).data.message
          : "Login failed. Make sure json-server is running on port 5000.";

      alert(message);
    }
  };

  return (
    <section className="bg-black flex justify-center items-center min-h-screen w-full  overflow-hidden">
      <Card className="relative w-100 p-6 rounded-xl shadow-lg border-none overflow-visible">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-md">
          <img src="/logooo.png" alt="logo" className="w-16 h-16" />
        </div>

        <h1 className="text-center font-bold mt-8 text-lg">
          Shifa International Hospital Ltd.
        </h1>

        <div className="mt-6">
          <label className="text-sky-900 font-medium">Email or ID:</label>
          <Input
            placeholder="Enter Email or ID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            prefix={<MdOutlineMarkEmailUnread />}
            className="rounded-3xl mt-1"
          />
        </div>

        <div className=" relative  mt-4">
          <label className="text-sky-900 font-medium">Password:</label>
          <Input
            placeholder="Enter password"
            value={password}
            type={showpassword ? "text" : "password"}
            onChange={(e) => setpassword(e.target.value)}
            prefix={<CiLock />}
            className="rounded-3xl mt-1"
          />
          <button
            type="button"
            onClick={togglepassword}
            className=" absolute right-0 insect-y-0 mt-3 pr-3 text-gray-600"
          >
            {showpassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <button
          className="bg-sky-700 w-full text-white p-2 mt-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-800 disabled:opacity-60"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Login <BiLogInCircle className="text-lg" />
        </button>

        <p className="text-center mt-4 text-gray-500">
          Don`t have an account?{" "}
          <Link href="/signup" className="text-sky-700 font-bold ml-1">
            Sign Up
          </Link>
        </p>
        
      </Card>
    </section>
  );
};

export default Login;
