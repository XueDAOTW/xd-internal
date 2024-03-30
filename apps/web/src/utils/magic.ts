import { Magic } from "magic-sdk";

const createMagic = (key: string) => {
  // Make sure that the window object is available
  if (typeof window !== "undefined") {
    return new Magic(key);
  }
};

const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!);

export default magic;
