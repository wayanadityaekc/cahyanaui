// Run a Zod schema and return the first error per field, so all missing fields show at once.
export function validateWith(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) return { ok: true, errors: {}, data: result.data };
  const errors = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key != null && !(key in errors)) errors[key] = issue.message;
  });
  return { ok: false, errors, data: null };
}
