import { postRouter } from "./post";
import { universitiesRouter } from "./universities";
import { trailsRouter } from "./trails";

export const routers = {
  post: postRouter,
  university: universitiesRouter,
  trail: trailsRouter,
}; 