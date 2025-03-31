import { createCallerFactory, createTRPCRouter } from "./trpc";
import { routers } from "./routers";
import { postRouter } from "~/server/api/routers/post";
import { universitiesRouter } from "~/server/api/routers/universities";
import { trailsRouter } from "~/server/api/routers/trails";
import { birdsRouter } from "~/server/api/routers/birds";
import { messagesRouter } from "~/server/api/routers/messages";
import { blogsRouter } from "~/server/api/routers/blogs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  universities: universitiesRouter,
  trails: trailsRouter,
  birds: birdsRouter,
  messages: messagesRouter,
  blogs: blogsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
