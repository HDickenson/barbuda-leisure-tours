import { Agent } from '@openai/agents';
import { z } from 'zod';

// A small helper to invoke named tools registered on an Agent.
// This keeps invocation in one place and centralizes validation.
export async function invokeTool(agent: Agent<any, any>, toolName: string, args: unknown) {
  // agent.tools is present on the Agent instance per types
  const tools: any[] = (agent as any).tools || [];
  const t = tools.find((x: any) => x?.name === toolName);
  if (!t) throw new Error(`Tool not found on agent: ${toolName}`);

  // If the tool was created with a Zod schema in `parameters`, validate
  const params = (t as any).parameters;
  if (params && typeof params === 'object') {
    try {
      // Many tool definitions in this repo use zod objects for parameters.
      // If the `parameters` is a zod schema, use it to parse/validate.
      if (typeof (params as any).parse === 'function') {
        (params as any).parse(args);
      }
    } catch (err) {
      // normalize zod error
      throw new Error(`Invalid arguments for tool ${toolName}: ${(err as any).message}`);
    }
  }

  // Preferred runtime method name is `invoke` (expects a JSON string) for FunctionTool;
  // some implementations expose `execute` which expects a parsed object.
  if ((t as any).invoke) {
    // invoke expects a string input (the runner serializes inputs). Provide JSON.
    const json = typeof args === 'string' ? args : JSON.stringify(args);
    const res = await (t as any).invoke.call(t, undefined, json, undefined);
    return res;
  }
  if ((t as any).execute) {
    const res = await (t as any).execute.call(t, args, undefined, undefined);
    return res;
  }
  if ((t as any).run) {
    const res = await (t as any).run.call(t, args, undefined, undefined);
    return res;
  }
  if ((t as any).call) {
    const res = await (t as any).call.call(t, args, undefined, undefined);
    return res;
  }
  throw new Error(`Tool ${toolName} does not expose an invokable function`);
}

// Lightweight helper to validate a plain object has a siteId string (used by crawler responses)
export const SiteIdSchema = z.object({ siteId: z.string() });
