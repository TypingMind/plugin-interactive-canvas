async function read_interactive_canvas_lines(params, userSettings, authorizedResources) {
  const source = authorizedResources?.previousRunOutput;
  if (typeof source !== 'string' || !source.length) {
    throw new Error('No interactive canvas source found. Call render_interactive_canvas first.');
  }
  const { startLine, endLine } = params;
  if (
    !Number.isInteger(startLine) ||
    !Number.isInteger(endLine) ||
    startLine < 1 ||
    endLine < startLine
  ) {
    throw new Error('Use integer line numbers with 1 <= startLine <= endLine.');
  }

  const lines = source.split(/\r\n|\n|\r/);
  if (startLine > lines.length) {
    throw new Error(
      `startLine exceeds the source length of ${lines.length} lines.`,
    );
  }
  const lastLine = Math.min(endLine, lines.length);
  return [
    `Lines ${startLine}-${lastLine} of ${lines.length}:`,
    ...lines
      .slice(startLine - 1, lastLine)
      .map((line, index) => `${startLine + index}: ${line}`),
  ].join('\n');
}
