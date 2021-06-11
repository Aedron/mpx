import * as path from 'path';
import * as fs from 'fs-extra';
import * as prettier from 'prettier';
import { AppConfig, ProjectConfig } from './types';

export function getProjectConfig(entry: string): ProjectConfig {
  const config = path.resolve(entry, 'project.config.json');
  return fs.readJsonSync(config);
}

export function getAppConfig(mpRoot: string): AppConfig {
  const config = path.resolve(mpRoot, 'app.json');
  return fs.readJsonSync(config);
}

export function isCodeComment(line: string): boolean {
  return line.trim().startsWith('//');
}

export function formatCode(code: string): string {
  const content = code.replace(`"use strict";`, '').replace(/\/\/#.+/g, '');
  try {
    return prettier.format(content, {
      semi: false,
      parser: 'babel',
    });
  } catch (e) {
    console.warn('Format code error: ', e);
    return content;
  }
}
