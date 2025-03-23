import { postRouter } from "./post";
import { universitiesRouter } from "./universities";
import { trailsRouter } from "./trails";
import { birdsRouter } from "./birds";

export const routers = {
  post: postRouter,
  university: universitiesRouter,
  trail: trailsRouter,
  birds: birdsRouter,
}; 