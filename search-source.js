async function search_interactive_canvas_source(
  params,
  userSettings,
  authorizedResources,
) {
  const source = authorizedResources?.previousRunOutput;
  if (typeof source !== 'string' || !source.length) {
    throw new Error('No interactive canvas source found. Call render_interactive_canvas first.');
  }
  if (typeof params.keyword !== 'string' || !params.keyword.trim()) {
    throw new Error('keyword must be a non-empty string.');
  }
  const limit = params.limit ?? 50;
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new Error('limit must be an integer from 1 to 200.');
  }

  const lines = source.split(/\r\n|\n|\r/);
  const keyword = params.keyword.toLowerCase();
  const matches = [];
  let totalMatches = 0;
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(keyword)) {
      totalMatches++;
      if (matches.length < limit) {
        matches.push(`${index + 1}: ${line}`);
      }
    }
  });

  return [
    `${totalMatches} matching lines; showing ${matches.length}. Source has ${lines.length} lines.`,
    ...matches,
  ].join('\n');
}
