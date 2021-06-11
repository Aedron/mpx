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
  return prettier.format(code.replace(`"use strict";\n`, ''), { semi: false, parser: 'babel' });
}
