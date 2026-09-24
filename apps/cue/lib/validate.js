// Runs a Zod schema and returns one message PER FIELD, so a guest sees everything
// that is missing in a single go instead of fixing one item per click.
// Keeps the first issue for each field - later issues on the same field would only
// push the same box around.
export function validateWith(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) return { ok: true, errors: {}, data: result.data };
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key != null && !(key in errors)) errors[key] = issue.message;
  }
  return { ok: false, errors, data: null };
}
