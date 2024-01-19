import { createEntrypoints } from "@langchain/scripts";
import * as path from "path";

// This lists all the entrypoints for the library. Each key corresponds to an
// importable path, eg. `import { AgentExecutor } from "langchain/agents"`.
// The value is the path to the file in `src/` that exports the entrypoint.
// This is used to generate the `exports` field in package.json.
// Order is not important.
const entrypoints = {
  agents: "agents",
  caches: "caches",
  "callbacks/base": "callbacks/base",
  "callbacks/manager": "callbacks/manager",
  "callbacks/promises": "callbacks/promises",
  chat_history: "chat_history",
  documents: "documents/index",
  embeddings: "embeddings",
  example_selectors: "example_selectors/index",
  "language_models/base": "language_models/base",
  "language_models/chat_models": "language_models/chat_models",
  "language_models/llms": "language_models/llms",
  load: "load/index",
  "load/serializable": "load/serializable",
  memory: "memory",
  messages: "messages/index",
  output_parsers: "output_parsers/index",
  outputs: "outputs",
  prompts: "prompts/index",
  prompt_values: "prompt_values",
  runnables: "runnables/index",
  retrievers: "retrievers",
  stores: "stores",
  tools: "tools",
  "tracers/base": "tracers/base",
  "tracers/console": "tracers/console",
  "tracers/initialize": "tracers/initialize",
  "tracers/log_stream": "tracers/log_stream",
  "tracers/run_collector": "tracers/run_collector",
  "tracers/tracer_langchain": "tracers/tracer_langchain",
  "tracers/tracer_langchain_v1": "tracers/tracer_langchain_v1",
  "utils/async_caller": "utils/async_caller",
  "utils/chunk_array": "utils/chunk_array",
  "utils/env": "utils/env",
  "utils/function_calling": "utils/function_calling",
  "utils/hash": "utils/hash",
  "utils/json_patch": "utils/json_patch",
  "utils/json_schema": "utils/json_schema",
  "utils/math": "utils/math",
  "utils/stream": "utils/stream",
  "utils/testing": "utils/testing/index",
  "utils/tiktoken": "utils/tiktoken",
  "utils/types": "utils/types",
  vectorstores: "vectorstores",
};

// Entrypoints in this list will
// 1. Be excluded from the documentation
// 2. Be only available in Node.js environments (for backwards compatibility)
const deprecatedNodeOnly = [];

// Entrypoints in this list require an optional dependency to be installed.
// Therefore they are not tested in the generated test-exports-* packages.
const requiresOptionalDependency = [];

const absTsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

createEntrypoints({
  entrypoints,
  deprecatedNodeOnly,
  requiresOptionalDependency,
  packageSuffix: "core",
  absTsConfigPath,
});
