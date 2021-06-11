import { injectGlobalReadonly } from './utils';
import { App } from './app';
import { Page } from './page';

injectGlobalReadonly('App', App);
injectGlobalReadonly('Page', Page);
