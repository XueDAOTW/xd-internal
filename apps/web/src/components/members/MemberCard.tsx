import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TwitterIcon from "../ui/icons/TwitterIcon";
import TelegramIcon from "../ui/icons/TelegramIcon";
import MailIcon from "../ui/icons/MailIcon";
import Shimmer from "../ui/Shimmer";

export default function MemberCard({ member }: { member: any }) {
  const modalName = `member-modal-${member.id}`;
  const [hasS1NFT, setHasS1NFT] = useState(false);
  const [loadingSeasonNFTs, setLoadingSeasonNFTs] = useState(false);

  useEffect(() => {
    async function checkNFT() {
      setLoadingSeasonNFTs(true);
      try {
        const response = await fetch(`/api/users/${member.id}/tokens`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => res.json());

        if (response.data) {
          if (response.data.includes(1)) {
            setHasS1NFT(true);
          }
        } else {
          toast.error(response.error ?? "Error retrieving members.");
        }
      } catch (error) {
        toast.error("Unknown error occurred.");
      }
      setLoadingSeasonNFTs(false);
    }
    checkNFT();
  }, [member.id]);

  return (
    <>
      <label htmlFor={modalName}>
        <div className="card card-side card-compact cursor-pointer rounded-xl border bg-base-100 shadow-lg transition duration-200 hover:scale-105">
          <div className="m-2 h-32 w-32 overflow-hidden rounded-lg">
            <Image
              src={
                member.image ||
                "https://buzhidao.s3.amazonaws.com/assets/default-avatar.png"
              }
              alt={member.name || "Default avatar"}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="card-body overflow-x-auto">
            <h2 className="font-semibold">{member.name}</h2>
            <div className="flex flex-wrap gap-1">
              {member.roles.map((role: any) => (
                <div
                  key={role.id}
                  className="badge-accent badge-outline badge badge-sm"
                >
                  {role.name}
                </div>
              ))}
              {loadingSeasonNFTs && <Shimmer width={48} height={16} />}
              {hasS1NFT && (
                <div className="badge-info badge-outline badge badge-sm">
                  season 1
                </div>
              )}
            </div>
          </div>
        </div>
      </label>

      <input type="checkbox" id={modalName} className="modal-toggle" />
      <label
        htmlFor={modalName}
        className="modal modal-bottom cursor-pointer sm:modal-middle"
      >
        <label
          className="modal-box relative border sm:max-w-full md:w-3/4 lg:max-w-3xl"
          htmlFor=""
        >
          <div className="card card-compact bg-base-100 sm:card-side">
            <div className="aspect-square overflow-hidden rounded-lg sm:h-72 sm:w-72">
              <Image
                src={
                  member.image ||
                  "https://buzhidao.s3.amazonaws.com/assets/default-avatar.png"
                }
                alt={member.name || "Default avatar"}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="card-body items-center sm:w-96">
              <h2 className="text-lg font-bold">{member.name}</h2>
              <div className="flex items-center gap-x-2">
                <Link
                  href={`mailto:${member.email}`}
                  className="h-6 w-6 text-base-content opacity-30 hover:text-primary hover:opacity-100"
                  target="_blank"
                >
                  <MailIcon />
                </Link>
                <Link
                  href={`https://twitter.com/${member.twitterUsername}`}
                  className="h-6 w-6 text-base-content opacity-30 hover:text-primary hover:opacity-100"
                  target="_blank"
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href={`https://t.me/${member.telegramUsername}`}
                  className="h-6 w-6 text-base-content opacity-30 hover:text-primary hover:opacity-100"
                  target="_blank"
                >
                  <TelegramIcon />
                </Link>
              </div>
              <div className="flex flex-wrap gap-1">
                {member.roles.map((role: any) => (
                  <div
                    key={role.id}
                    className="badge-accent badge-outline badge badge-sm"
                  >
                    {role.name}
                  </div>
                ))}
                {loadingSeasonNFTs && <Shimmer width={48} height={16} />}
                {hasS1NFT && (
                  <div className="badge-info badge-outline badge badge-sm">
                    season 1
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-y-2 py-4 text-sm">
                <div className="flex gap-x-2">
                  <h3 className="font-bold">Location</h3>
                  {member.location}
                </div>
                <div className="flex gap-x-2">
                  <h3 className="font-bold">Company / Projects</h3>
                  {member.currentCompany}
                </div>
                <div className="flex gap-x-2">
                  <h3 className="font-bold">Role</h3>
                  {member.currentRole}
                </div>
                <div className="flex gap-x-2">
                  <h3 className="font-bold">Hobbies</h3>
                  {member.hobbies}
                </div>
              </div>
            </div>
          </div>
        </label>
      </label>
    </>
  );
}
