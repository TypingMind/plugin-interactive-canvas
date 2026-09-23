async function read_interactive_canvas_source(params, userSettings, authorizedResources) {
  const source = authorizedResources?.previousRunOutput;
  if (typeof source !== 'string' || !source.length) {
    throw new Error('No interactive canvas source found. Call render_interactive_canvas first.');
  }
  return source;
}
