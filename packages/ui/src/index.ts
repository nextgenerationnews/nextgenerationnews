import App from './App.svelte';
import { loggingService } from 'services/Logging.service';
import { i18nService } from './services/i18n.service';

import 'styles/AppTheme.scss';

loggingService.initialize();
i18nService.initialize();

new App({
  target: document.body,
});
