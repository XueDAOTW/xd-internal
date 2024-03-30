import { APIRoute, uuid } from "next-s3-upload";

export default APIRoute.configure({
  // TODO: Add validation and authentication
  key() {
    const randomId = uuid();
    return `assets/users/${randomId}`;
  },
});
