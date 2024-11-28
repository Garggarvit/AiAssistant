import { EventData, Page } from '@nativescript/core';
import { AssistantViewModel } from './main-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new AssistantViewModel();
}

export function onDrawerButtonTap(args: EventData) {
  const page = <Page>args.object;
  const assistantVM = page.bindingContext as AssistantViewModel;
  assistantVM.startListening();
}