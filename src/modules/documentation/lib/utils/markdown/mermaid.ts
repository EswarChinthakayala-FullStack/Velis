/**
 * Safe client-side loader & renderer helper for Mermaid diagrams
 */
export async function renderMermaidDiagram(
  elementId: string,
  chartDefinition: string
): Promise<string> {
  try {
    const mermaidModule = await import('mermaid');
    const mermaid = mermaidModule.default;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });

    const { svg } = await mermaid.render(`mermaid-${elementId}`, chartDefinition);
    return svg;
  } catch (err) {
    console.error('Mermaid render error:', err);
    return `<div class="p-3 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded">Failed to render Mermaid diagram.</div>`;
  }
}
