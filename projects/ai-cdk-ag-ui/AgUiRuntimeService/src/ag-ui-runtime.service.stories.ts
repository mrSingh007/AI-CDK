import type { Meta, StoryObj } from '@storybook/angular';
import { AiAgUiRuntimeServiceStoryDemoComponent } from './ag-ui-runtime-service.story-demo';

interface AgUiRuntimeServiceApiRow {
  readonly member: string;
  readonly category: 'Signal' | 'Method';
  readonly signature: string;
  readonly use: string;
}

const API_ROWS: readonly AgUiRuntimeServiceApiRow[] = [
  {
    category: 'Signal',
    member: 'messages',
    signature: 'Signal<AgentMessage[]>',
    use: 'Read the local structured message timeline used by chat UIs and tool renderers.',
  },
  {
    category: 'Signal',
    member: 'isStreaming',
    signature: 'Signal<boolean>',
    use: 'Disable inputs or show loading UI while a run is active.',
  },
  {
    category: 'Signal',
    member: 'appState',
    signature: 'Signal<State>',
    use: 'Consume the latest shared application state snapshot emitted by the runtime.',
  },
  {
    category: 'Signal',
    member: 'headers',
    signature: 'Signal<Record<string, string>>',
    use: 'Inspect the effective request headers after combining source headers and overrides.',
  },
  {
    category: 'Signal',
    member: 'isAwaitingHumanFeedback',
    signature: 'Signal<boolean>',
    use: 'Detect waiting frontend-tool interactions before resuming a run.',
  },
  {
    category: 'Method',
    member: 'initializeAgent',
    signature: '(config: AgentConfig) => void',
    use: 'Attach a runtime, register tools, seed messages/state, and reset transient service state.',
  },
  {
    category: 'Method',
    member: 'sendMessage',
    signature:
      '(message: AgentOutboundMessage, context?: AgentContext[], forwardedProps?: unknown) => Promise<void>',
    use: 'Append an outbound message, execute the run, and process any tool-driven continuations.',
  },
  {
    category: 'Method',
    member: 'resolveInteraction',
    signature:
      '(interactionId: string, response: unknown, options?: AgentInteractionResolutionOptions) => void',
    use: 'Resolve a waiting render interaction and optionally append a local UI-only user message.',
  },
  {
    category: 'Method',
    member: 'setHeaders',
    signature: '(headers: Record<string, string | null>) => void',
    use: 'Override request headers for future runs. Use null to remove a key.',
  },
  {
    category: 'Method',
    member: 'clearHeaders',
    signature: '(names: string[]) => void',
    use: 'Clear explicit header overrides by name.',
  },
  {
    category: 'Method',
    member: 'cancelRequest',
    signature: '() => void',
    use: 'Abort the active run and resolve waiting interactions as cancelled.',
  },
  {
    category: 'Method',
    member: 'reset',
    signature: '() => void',
    use: 'Return the service to an uninitialized state and clear local/runtime data.',
  },
  {
    category: 'Method',
    member: 'updateState',
    signature: '(state: State) => void',
    use: 'Persist shared application state locally and in the runtime for future runs.',
  },
];

const IMPORT_SNIPPET = `import { AgUiRuntimeService } from '@ai-cdk/ag-ui/AgUiRuntimeService';`;

const INITIALIZE_SNIPPET = `import { inject } from '@angular/core';
import { AgUiRuntimeService, type AgentTool } from '@ai-cdk/ag-ui/AgUiRuntimeService';

const agentService = inject(AgUiRuntimeService);

const tools: readonly AgentTool[] = [
  {
    name: 'ui_request_confirmation',
    description: 'Ask the user to confirm before continuing.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        approveButtonText: { type: 'string' },
        cancelButtonText: { type: 'string' }
      },
      required: ['text', 'approveButtonText', 'cancelButtonText']
    },
    render: async (args, ctx) => {
      const response = await ctx.renderAndWait({
        props: {
          text: String(args['text'] ?? ''),
          approveButtonText: String(args['approveButtonText'] ?? 'Approve'),
          cancelButtonText: String(args['cancelButtonText'] ?? 'Reject')
        }
      });

      return { content: { response } };
    }
  }
];

agentService.initializeAgent({
  url: 'http://localhost:3000',
  headers: () => ({ Authorization: 'Bearer demo-token' }),
  tools,
  initialState: { cards: [] }
});`;

const HEADERS_SNIPPET = `agentService.setHeaders({
  Authorization: 'Bearer refreshed-token',
  'x-trace-id': 'storybook-demo'
});

agentService.clearHeaders(['x-trace-id']);`;

const RENDER_SNIPPET = `const eventHandlers = {
  onConfirmed: () => agentService.resolveInteraction(interactionId, 'Confirmed'),
  onRejected: () => agentService.resolveInteraction(interactionId, 'Rejected')
};

<ai-payload-renderer
  [registry]="registry"
  [renderRequest]="renderPart.request"
  [eventHandlers]="eventHandlers"
  [ariaLiveMode]="'polite'"
/>`;

const STATE_SNIPPET = `const cards = computed(() => agentService.appState()['cards'] ?? []);

agentService.updateState({
  ...agentService.appState(),
  cards: [...cards(), { title: 'Human feedback result', note: 'Resolved with Confirmed.' }]
});`;

const meta: Meta<AiAgUiRuntimeServiceStoryDemoComponent> = {
  title: 'Getting Started/ag-ui/AgUiRuntimeService',
  component: AiAgUiRuntimeServiceStoryDemoComponent,
  parameters: {
    controls: {
      disable: true,
      hideNoControlsWarning: true,
    },
  },
};

export default meta;
type Story = StoryObj<AiAgUiRuntimeServiceStoryDemoComponent>;

export const Overview: Story = {
  render: () => ({
    props: {
      apiRows: API_ROWS,
      importSnippet: IMPORT_SNIPPET,
      initializeSnippet: INITIALIZE_SNIPPET,
      headersSnippet: HEADERS_SNIPPET,
      renderSnippet: RENDER_SNIPPET,
      stateSnippet: STATE_SNIPPET,
    },
    template: `
      <style>
        .ai-agent-service-docs {
          display: grid;
          gap: 1rem;
          color: #14263f;
          font-family: 'Fraunces', 'Iowan Old Style', 'Palatino Linotype', serif;
          line-height: 1.6;
        }

        .ai-agent-service-docs__hero,
        .ai-agent-service-docs__section {
          border: 1px solid #d9e5f1;
          border-radius: 20px;
          padding: 1.15rem;
          background:
            radial-gradient(circle at top right, rgb(200 230 255 / 38%), transparent 28%),
            linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
          box-shadow: 0 12px 28px rgb(15 23 42 / 4%);
        }

        .ai-agent-service-docs__eyebrow {
          margin: 0 0 0.35rem;
          color: #4b7197;
          font:
            700 0.82rem/1.2 'Manrope',
            'Avenir Next',
            'Segoe UI',
            sans-serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .ai-agent-service-docs__title {
          margin: 0;
          color: #0d2240;
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          line-height: 1.08;
        }

        .ai-agent-service-docs__lead {
          margin: 0.75rem 0 0;
          max-width: 54rem;
          color: #3d5878;
          font-size: 1rem;
        }

        .ai-agent-service-docs__section-title {
          margin: 0 0 0.55rem;
          color: #11345a;
          font:
            700 1.2rem/1.25 'Manrope',
            'Avenir Next',
            'Segoe UI',
            sans-serif;
        }

        .ai-agent-service-docs__section-text {
          margin: 0;
          color: #45617f;
        }

        .ai-agent-service-docs__code {
          margin: 0.9rem 0 0;
          overflow: auto;
          border-radius: 16px;
          border: 1px solid #1f314a;
          background: #0f1b2d;
          color: #d8e6fb;
          padding: 0.9rem 1rem;
          font:
            500 0.8rem/1.55 'JetBrains Mono',
            'SFMono-Regular',
            'Menlo',
            monospace;
        }

        .ai-agent-service-docs__table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.9rem;
          font:
            500 0.9rem/1.5 'Manrope',
            'Avenir Next',
            'Segoe UI',
            sans-serif;
        }

        .ai-agent-service-docs__table th,
        .ai-agent-service-docs__table td {
          border: 1px solid #cfdeed;
          padding: 0.7rem;
          text-align: left;
          vertical-align: top;
        }

        .ai-agent-service-docs__table thead {
          background: #edf5ff;
          color: #143a63;
        }

        .ai-agent-service-docs__grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 0.9rem;
        }

        .ai-agent-service-docs__snippet {
          display: grid;
          gap: 0.5rem;
        }

        .ai-agent-service-docs__snippet-title {
          margin: 0;
          color: #1c466f;
          font:
            700 0.96rem/1.3 'Manrope',
            'Avenir Next',
            'Segoe UI',
            sans-serif;
        }
      </style>

      <section class="ai-agent-service-docs">
        <header class="ai-agent-service-docs__hero">
          <p class="ai-agent-service-docs__eyebrow">AG-UI Runtime Service</p>
          <h1 class="ai-agent-service-docs__title">AgUiRuntimeService</h1>
          <p class="ai-agent-service-docs__lead">
            AgUiRuntimeService coordinates AG-UI transport runs, frontend tool rendering, shared state,
            and local message timeline management for Angular chat experiences.
          </p>
        </header>

        <section class="ai-agent-service-docs__section" aria-labelledby="ai-agent-service-import">
          <h2 id="ai-agent-service-import" class="ai-agent-service-docs__section-title">Import</h2>
          <p class="ai-agent-service-docs__section-text">
            Import the secondary entrypoint directly when you want the service and its public types.
          </p>
          <pre class="ai-agent-service-docs__code">{{ importSnippet }}</pre>
        </section>

        <section class="ai-agent-service-docs__section" aria-labelledby="ai-agent-service-api">
          <h2 id="ai-agent-service-api" class="ai-agent-service-docs__section-title">
            Public API reference
          </h2>
          <p class="ai-agent-service-docs__section-text">
            Every public signal and method exposed by the service, with the intended consumer use.
          </p>

          <table class="ai-agent-service-docs__table">
            <caption class="ai-agent-service-docs__section-text">
              AgUiRuntimeService public signals and methods
            </caption>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Category</th>
                <th scope="col">Signature</th>
                <th scope="col">Use</th>
              </tr>
            </thead>
            <tbody>
              @for (row of apiRows; track row.member) {
                <tr>
                  <td><code>{{ row.member }}</code></td>
                  <td>{{ row.category }}</td>
                  <td><code>{{ row.signature }}</code></td>
                  <td>{{ row.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </section>

        <section class="ai-agent-service-docs__section" aria-labelledby="ai-agent-service-example">
          <h2 id="ai-agent-service-example" class="ai-agent-service-docs__section-title">Example</h2>
          <p class="ai-agent-service-docs__section-text">
            This sandbox-style example uses a user-provided backend URL so you can manually verify
            headers, frontend tool rendering, and shared state consumption against your own AG-UI
            server.
          </p>
          <div style="margin-top: 1rem;">
            <ai-ag-ui-runtime-service-story-demo />
          </div>
        </section>

        <section class="ai-agent-service-docs__section" aria-labelledby="ai-agent-service-usage">
          <h2 id="ai-agent-service-usage" class="ai-agent-service-docs__section-title">
            Usage snippets
          </h2>
          <div class="ai-agent-service-docs__grid">
            <section class="ai-agent-service-docs__snippet">
              <h3 class="ai-agent-service-docs__snippet-title">Initialize with runtime config</h3>
              <pre class="ai-agent-service-docs__code">{{ initializeSnippet }}</pre>
            </section>
            <section class="ai-agent-service-docs__snippet">
              <h3 class="ai-agent-service-docs__snippet-title">Set and clear headers</h3>
              <pre class="ai-agent-service-docs__code">{{ headersSnippet }}</pre>
            </section>
            <section class="ai-agent-service-docs__snippet">
              <h3 class="ai-agent-service-docs__snippet-title">Render waiting tools</h3>
              <pre class="ai-agent-service-docs__code">{{ renderSnippet }}</pre>
            </section>
            <section class="ai-agent-service-docs__snippet">
              <h3 class="ai-agent-service-docs__snippet-title">Consume shared state</h3>
              <pre class="ai-agent-service-docs__code">{{ stateSnippet }}</pre>
            </section>
          </div>
        </section>

        <section>
          <h3>Backend Code</h3>
          <a href="https://ai.pydantic.dev/ui/ag-ui/#handle-a-starlette-request" target="_blank">Check Pydantic AI</a>
        </section>
      </section>
    `,
  }),
};
