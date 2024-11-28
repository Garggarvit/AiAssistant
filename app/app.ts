import { Application } from '@nativescript/core';
import { PermissionsService } from './services/permissions/permissions.service';

Application.on(Application.launchEvent, async () => {
  const permissionsService = new PermissionsService();
  const granted = await permissionsService.requestPermissions();
  if (!granted) {
    console.error('Required permissions not granted');
    // Handle permissions not granted
  }
});

Application.run({ moduleName: 'app-root' });