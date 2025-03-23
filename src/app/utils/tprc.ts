import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson"; // ✅ Import superjson
import type { AppRouter } from "~/server/api/root";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson, // ✅ Add transformer to match server
    }),
  ],
});
