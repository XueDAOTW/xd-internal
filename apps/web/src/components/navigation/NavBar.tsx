import magic from "@/utils/magic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { useDisconnect } from "wagmi";
import { signOut, useSession } from "next-auth/react";
import ThemeSelector from "./ThemeSelector";

export default function NavBar({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string>();
  const { disconnect } = useDisconnect();
  const { data } = useSession();

  const logout = async () => {
    disconnect();
    const isLoggedIn = await magic?.user.isLoggedIn();
    if (isLoggedIn) {
      await magic?.user.logout();
    }
    await signOut({
      redirect: false,
    });
  };

  useEffect(() => {
    setCurrentTab(router.pathname);
  }, [router.pathname]);

  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar sticky top-0 z-50 bg-base-100 p-4">
          <div className="flex-none md:hidden">
            <label htmlFor="nav-drawer" className="btn-ghost btn-circle btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <Link href="/" className="flex-1 gap-x-2">
            <Image
              src="/images/logo.svg"
              alt={"Bu Zhi DAO Logo"}
              width={40}
              height={40}
              className="hidden h-8 w-8 md:flex"
            />
            <p className="text-xl font-bold uppercase">Bu Zhi DAO Internal</p>
          </Link>
          {data?.user && (
            <div className="flex-none gap-2">
              <div className="tabs tabs-boxed hidden gap-2 bg-base-100 uppercase md:flex">
                <Link
                  href="https://www.notion.so/buzhidao/4e5418fde58f4075895500a55ce1be85?v=0e646f1353cc48cfa21079c08a22482e&pvs=4"
                  className="tab border border-primary text-xs text-primary hover:border-base-content hover:text-base-content"
                  target="_blank"
                >
                  Docs
                </Link>
                <Link
                  href="/members"
                  className={clsx(
                    "tab border border-primary text-xs text-primary hover:border-base-content hover:text-base-content",
                    currentTab?.includes("/members")
                      ? "tab-active border-none"
                      : "border",
                  )}
                >
                  Members
                </Link>
              </div>
              <ThemeSelector />
              <div className="dropdown-end dropdown">
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  <div className="w-10 rounded-full">
                    <Image
                      src={
                        data.user.image ||
                        "https://buzhidao.s3.amazonaws.com/assets/default-avatar.png"
                      }
                      alt={`Avatar of ${data.user.id}`}
                      width={40}
                      height={40}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge-secondary badge badge-xs lowercase">
                        Coming Soon
                      </span>
                    </a>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4 text-sm uppercase">
          <li>
            <Link
              href="https://buzhidao.notion.site/Ni-Zhi-Bu-Zhi-DAO-2015ec6ce79e4d3ea4ea2549127ab419"
              target="_blank"
            >
              Docs
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={clsx(
                "justify-between",
                currentTab?.includes("/governance") && "bg-primary",
              )}
            >
              Governance
              <span className="badge-secondary badge badge-xs lowercase">
                Coming Soon
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/members"
              className={clsx(currentTab?.includes("/members") && "bg-primary")}
            >
              Members
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
