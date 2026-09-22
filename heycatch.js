// External module so the existing Content Security Policy can keep blocking inline scripts.
import { analytics } from 'https://esm.sh/@heycatch/sdk@0.7.0';
analytics.init({
  projectKey: 'hck_pk_aQdS2pASnZ6L9_FyFWWwS61h0-8Hhie4',
  install: { framework: 'web', agent: 'claude-code' },
  requestBatching: false,
});
