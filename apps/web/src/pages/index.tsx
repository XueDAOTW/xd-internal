import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center justify-center py-4 md:py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="hero h-screen bg-base-100">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">welcome</h1>
              <p className="py-6">{data?.user?.name || data?.user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
