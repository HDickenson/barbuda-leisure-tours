import { describe, it, expect } from 'vitest';
import { invokeTool } from '../toolInvoker';
import { z } from 'zod';

describe('invokeTool', () => {
  it('finds a tool by name, validates args and calls execute', async () => {
    // mock agent with a single tool
    const called: any = { args: null };
    const myTool = {
      name: 'echo',
      parameters: z.object({ msg: z.string() }),
      execute: async ({ msg }: any) => {
        called.args = msg;
        return { result: { echoed: msg } };
      }
    } as any;
    const agent: any = { tools: [myTool] };

    const res = await invokeTool(agent, 'echo', { msg: 'hello' });
    expect(called.args).toBe('hello');
    // ensure return is the tool return value
    expect(res).toEqual({ result: { echoed: 'hello' } });
  });

  it('throws if validation fails', async () => {
    const myTool = {
      name: 'echo',
      parameters: z.object({ msg: z.string() }),
      execute: async () => ({})
    } as any;
    const agent: any = { tools: [myTool] };
    await expect(invokeTool(agent, 'echo', { wrong: true } as any)).rejects.toThrow();
  });
});
