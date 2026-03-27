"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setToken } from "@/lib/api";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ start loading

    try {
      const { res, data } = await apiFetch("/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        return;
      }

      if (data?.token) {
        setToken(data.token);
        router.replace("/dashboard");
        return;
      }

      setError("Login failed: token missing");
    } catch (error) {
      console.log(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md p-8 border border-black/10 rounded-2xl bg-white shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center tracking-wide">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white border border-black/20 focus:outline-none focus:border-black transition"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white border border-black/20 focus:outline-none focus:border-black transition"
          />

          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-black/60 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-black/90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-center">
              {error}
            </div>
          )}
        </form>

        <p className="text-sm text-center mt-6 text-black/70">
          Don't have an account?{" "}
          <Link href="/signup" className="underline hover:text-black">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
