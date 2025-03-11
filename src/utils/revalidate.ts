import fetch from "node-fetch";
import { REVALIDATION_HASH_KEY, NEXT_JS_URL } from "../config/constant";

export const revalidationTag = async (tag: string) => {
  try {
    // Your Next.js frontend URL

    // The revalidation secret from your environment variables

    if (!REVALIDATION_HASH_KEY) {
      console.error(
        "REVALIDATION_HASH_KEY is not defined in environment variables"
      );
      return false;
    }

    const response = await fetch(
      `${NEXT_JS_URL}/api/revalidate?key=${REVALIDATION_HASH_KEY}&tag=${tag}`,
      { method: "GET" }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error revalidating tag ${tag}:`, error);
      return false;
    }

    const result = await response.json();
    console.log(`Successfully revalidated tag: ${tag}`, result);
    return true;
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error);
    return false;
  }
};
