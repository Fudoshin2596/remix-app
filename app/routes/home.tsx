import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { UserPanel } from "~/components/user-panel";
import { getOtherUsers } from "~/utils/user.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  return json({ users });
};

export default function Home() {
  const { users } = useLoaderData();
  return (
    <div className="h-full flex">
      <UserPanel users={users} />
      <div className="flex-1"></div>
    </div>
  );
}
