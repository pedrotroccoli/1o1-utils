import { useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { EXAMPLES, EXAMPLES_BY_ID, type Example } from "../content/examples/index";
import pkg from "../../../package.json" with { type: "json" };

const PKG_VERSION: string = pkg.version;

const indexHtml = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>1o1-utils playground</title></head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.ts"></script>
  </body>
</html>`;

type PlaygroundProps = {
  /** Lock playground to a single example by id (no selector). */
  utilityId?: string;
  /** Initial example shown when selector is enabled. */
  defaultId?: string;
  /** Editor + console height in CSS units. */
  height?: string;
};

function groupByCategory(examples: Example[]) {
  const map = new Map<string, Example[]>();
  for (const ex of examples) {
    const list = map.get(ex.category) ?? [];
    list.push(ex);
    map.set(ex.category, list);
  }
  return [...map.entries()];
}

function Sandbox({ example, height }: { example: Example; height: string }) {
  const showPreview = example.category === "Browser";

  return (
    <SandpackProvider
      key={example.id}
      template="vanilla-ts"
      theme="dark"
      customSetup={{
        dependencies: {
          "1o1-utils": PKG_VERSION,
        },
      }}
      files={{
        "/index.ts": { code: example.code, active: true },
        "/index.html": { code: indexHtml, hidden: true },
      }}
      options={{
        recompileMode: "delayed",
        recompileDelay: 400,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showTabs={false}
          showLineNumbers
          wrapContent
          style={{ height }}
        />
        {showPreview ? (
          <SandpackPreview style={{ height }} showRefreshButton showOpenInCodeSandbox={false} />
        ) : (
          <SandpackConsole
            style={{ height }}
            standalone={false}
            showHeader
            resetOnPreviewRestart
          />
        )}
      </SandpackLayout>
      {!showPreview ? (
        <div style={{ display: "none" }}>
          <SandpackPreview />
        </div>
      ) : null}
    </SandpackProvider>
  );
}

export default function Playground({
  utilityId,
  defaultId,
  height = "360px",
}: PlaygroundProps) {
  const pinnedExample = utilityId ? EXAMPLES_BY_ID[utilityId] : undefined;

  if (pinnedExample) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Sandbox example={pinnedExample} height={height} />
        <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: 0 }}>
          Live — runs <code>1o1-utils@{PKG_VERSION}</code> in your browser.
        </p>
      </div>
    );
  }

  const initial = defaultId && EXAMPLES_BY_ID[defaultId] ? defaultId : EXAMPLES[0].id;
  const [exampleId, setExampleId] = useState(initial);
  const example = useMemo(
    () => EXAMPLES_BY_ID[exampleId] ?? EXAMPLES[0],
    [exampleId]
  );
  const grouped = useMemo(() => groupByCategory(EXAMPLES), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <span style={{ fontWeight: 600 }}>Example:</span>
        <select
          value={exampleId}
          onChange={(e) => setExampleId(e.target.value)}
          style={{
            padding: "0.35rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid var(--sl-color-gray-5)",
            background: "var(--sl-color-bg)",
            color: "var(--sl-color-text)",
            fontFamily: "inherit",
          }}
        >
          {grouped.map(([category, items]) => (
            <optgroup key={category} label={category}>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <Sandbox example={example} height={height} />

      <p style={{ fontSize: "0.8rem", opacity: 0.75, margin: 0 }}>
        Runs <code>1o1-utils@{PKG_VERSION}</code> from npm in your browser. Edit
        the code — output appears in the console.
      </p>
    </div>
  );
}
