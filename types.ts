import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  Member: (Member & { profile: Profile })[];
};
