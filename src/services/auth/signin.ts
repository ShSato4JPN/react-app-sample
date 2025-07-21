import type { User } from "@/types/data";
import { fetcher } from "@/utils/fetcher";

export type SignInParams = {
  username: string;
  password: string;
};

const signin = async (
  context: ApiContext,
  params: SiginParams,
): Promise<User> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, "")}/auth/signin`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    },
  );
};

export default signin;
