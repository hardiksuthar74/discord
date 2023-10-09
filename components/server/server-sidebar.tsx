import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/server/server-header";

interface ServerSiderbarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSiderbarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Member: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.Channel.filter(
    (individualChannel) => individualChannel.type === ChannelType.TEXT
  );
  const audioChannels = server?.Channel.filter(
    (individualChannel) => individualChannel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.Channel.filter(
    (individualChannel) => individualChannel.type === ChannelType.VIDEO
  );

  const members = server?.Member.filter(
    (individualMember) => individualMember.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.Member.find(
    (individualMember) => individualMember.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};
