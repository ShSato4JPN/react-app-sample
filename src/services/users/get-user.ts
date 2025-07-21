import type { ApiContext, User } from "@/types/data";
import { fetcher } from "@/utils/fetcher";

const getUser = async (
  context: ApiContext,
  { id }: GetUserParams,
): Promise<User> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, "")}/users/${id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
};

export default getUser;
