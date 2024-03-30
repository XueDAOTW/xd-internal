import magic from "@/utils/magic";
import clsx from "clsx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EmailLogin() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      if (!magic) throw new Error(`magic not defined`);

      if (!email || email.length === 0) {
        toast.error("Please enter your email.");
        return;
      }

      const didToken = await magic.auth.loginWithEmailOTP({
        email,
      });

      const response = await signIn("magic", {
        didToken,
        callbackUrl: router.query.callbackUrl as string,
      });

      if (response?.error) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Unknown error occurred while logging in.");
    }
    setLoginLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="w-full rounded-xl">
      <div className="flex w-full flex-col items-center gap-y-2 sm:input-group sm:flex-row">
        <input
          name="email"
          type="text"
          value={email}
          placeholder="Enter your email"
          className="input-bordered input-primary input w-full text-base-content"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={clsx(
            "btn-primary btn w-full sm:w-auto",
            loginLoading && "loading",
          )}
        >
          {loginLoading ? "Logging in..." : "Get OTP"}
        </button>
      </div>
    </form>
  );
}
