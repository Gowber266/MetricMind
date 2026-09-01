module.exports = {
  // Only allow the exact metrics/dimensions approved for AI access.
  // This is the governance boundary Sravani + Srinivethitha(QA)/Raj coordinate on.
  contextToApiScopesFn: () => ['graphql', 'meta', 'data'],

  scheduledRefreshTimer: 60,
};
