// ============================================================
// SAFETALK AI
// ADMIN FRONTEND API SERVICE
// ============================================================

export async function adminFetch(
  url,
  options = {}
) {

  const response =
    await fetch(
      url,
      {
        ...options,

        headers: {
          ...(options.body &&
            !(options.body instanceof FormData)
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          ...options.headers,
        },
      }
    );


  let data;


  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      "Invalid server response."
    );

  }


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Request failed."
    );

  }


  return data;
}