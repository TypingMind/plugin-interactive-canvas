async function update_interactive_canvas(params, userSettings, authorizedResources) {
  var previous =
    (authorizedResources && authorizedResources.previousRunOutput) || '';

  if (typeof previous !== 'string' || !previous.length) {
    throw new Error(
      'No previously rendered interactive canvas found to patch. Call `render_interactive_canvas` first to render the initial HTML, then use `update_interactive_canvas` for follow-up edits.',
    );
  }

  var edits = params && params.edits;
  if (!Array.isArray(edits) || edits.length === 0) {
    throw new Error(
      '`edits` must be a non-empty array of {oldText, newText} objects.',
    );
  }

  var html = previous;
  for (var i = 0; i < edits.length; i++) {
    var edit = edits[i] || {};
    var oldText = edit.oldText;
    var newText = edit.newText;

    if (typeof oldText !== 'string' || typeof newText !== 'string') {
      throw new Error(
        'Edit #' +
          (i + 1) +
          ' must have string `oldText` and `newText` properties.',
      );
    }
    if (!oldText.length) {
      throw new Error(
        'Edit #' +
          (i + 1) +
          ' has an empty `oldText`. Provide a non-empty substring to match.',
      );
    }

    var firstIndex = html.indexOf(oldText);
    if (firstIndex === -1) {
      throw new Error(
        'Edit #' +
          (i + 1) +
          ": `oldText` was not found in the current HTML. Make sure it is copied EXACTLY (including whitespace and casing) from the current HTML, or fall back to `render_interactive_canvas` with the full updated HTML.",
      );
    }
    var lastIndex = html.lastIndexOf(oldText);
    if (firstIndex !== lastIndex) {
      throw new Error(
        'Edit #' +
          (i + 1) +
          ": `oldText` matched more than once in the current HTML. Include more surrounding context so it matches exactly once.",
      );
    }

    html =
      html.slice(0, firstIndex) + newText + html.slice(firstIndex + oldText.length);
  }

  return html;
}
