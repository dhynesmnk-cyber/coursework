// index.js — the AI tools the background runner knows about. Each module
// exports validate(input) -> cleaned value, and run(value) -> result.
import * as blog from "./blog.js";
import * as shotPrompts from "./shot-prompts.js";
import * as leads from "./leads.js";
import * as pitch from "./pitch.js";

export const AI_TOOLS = {
  "blog-writer": blog,
  "shot-prompts": shotPrompts,
  leads,
  pitch,
};
