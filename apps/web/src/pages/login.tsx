import WalletConnectButton from "@/components/login/WalletConnectButton";
import EmailLogin from "@/components/login/EmailLogin";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();

  // Route to home page once authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    if (router.query?.error) {
      toast.error(router.query.error.toString());
    }
  }, [router.query.error]);

  return (
    <>
      <div className="mx-auto w-full p-4 md:p-16">
        <div className="flex items-center justify-center">
          {["loading", "authenticated"].includes(status) ? (
            <LoadingSpinner />
          ) : (
            <div className="card card-compact w-full border border-primary p-2 shadow-xl md:w-96">
              <div className="card-body flex flex-col items-center text-center">
                <h2 className="card-title font-bold uppercase">Sign In</h2>
                <WalletConnectButton />
                <div className="divider">OR</div>
                <EmailLogin />
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}
