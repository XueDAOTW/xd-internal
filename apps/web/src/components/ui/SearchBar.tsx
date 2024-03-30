import { useState } from "react";

export default function SearchBar({
  onSubmit,
}: {
  onSubmit: (keyword: string) => void;
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(searchKeyword);
      }}
      className="w-full"
    >
      <div className="form-control">
        <div className="input-group-sm input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input-bordered input input-sm w-full"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="btn-outline btn-primary btn-square btn-sm btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>{" "}
    </form>
  );
}
