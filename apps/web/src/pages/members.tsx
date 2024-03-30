import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MemberCard from "@/components/members/MemberCard";
import SearchBar from "@/components/ui/SearchBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddMembersModal from "@/components/members/AddMembersModal";

export default function Members() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getMembers = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => res.json());

      if (response.data) {
        setAllMembers(response.data);
        setMembers(response.data);
      } else {
        toast.error(response.error ?? "Error retrieving members.");
      }
    } catch (error) {
      toast.error("Unknown error occurred.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  const search = (keyword: string) => {
    const filteredMembers = allMembers.filter((member) => {
      return `${member.email.toLowerCase()} ${member.name?.toLowerCase()} ${member.currentCompany?.toLowerCase()} ${member.currentRole?.toLowerCase()}`.includes(
        keyword.toLowerCase(),
      );
    });
    setMembers(filteredMembers);
  };

  return (
    <div className="mx-auto w-full p-4 md:p-16">
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col items-center gap-y-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-xl font-bold uppercase md:px-1">Members</h2>
              <div className="flex w-full gap-x-2 md:w-auto">
                <SearchBar onSubmit={search} />
                {data?.user.roles.find((role) => role.name === "admin") && (
                  <AddMembersModal />
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members &&
                members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
