import { postRouter } from "./post";
import { universitiesRouter } from "./universities";
import { trailsRouter } from "./trails";
import { birdsRouter } from "./birds";
import { messagesRouter } from "./messages";
import { creationRouter } from "./creation"; 

export const routers = {
  post: postRouter,
  universities: universitiesRouter,
  trails: trailsRouter,
  birds: birdsRouter,
  messages: messagesRouter,
  creation: creationRouter,
}; 