export const fetcher = async (
  resource: RequestInfo,
  init?: RequestInit,
): Promise<void> => {
  const res = await fetch(resource, init);

  if (!res.ok) {
    const errorRes = await res.json();

    throw new Error(
      errorRes.message ?? "API リクエスト中にエラーが発生しました",
    );
  }

  return res.json();
};
