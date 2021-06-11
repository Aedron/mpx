import * as path from 'path';
import * as fs from 'fs-extra';
import { AppConfig, BuildConfig, ProjectConfig } from './types';
import { formatCode, getAppConfig, getProjectConfig } from './utils';
import { transformWxml } from './wxml';

export class Builder {
  constructor(config: BuildConfig) {
    this.config = config;
    this.projectConfig = getProjectConfig(config.entry);
    this.mpRoot = path.resolve(
      config.entry,
      this.projectConfig.miniprogramRoot,
    );
    this.appConfig = getAppConfig(this.mpRoot);
    this.init();
  }

  private readonly config: BuildConfig;

  private readonly projectConfig: ProjectConfig;

  private readonly appConfig: AppConfig;

  private readonly mpRoot: string;

  private readonly init = () => {
    fs.ensureDirSync(this.config.out);
  };

  private readonly handleSourceFiles = async () => {
    // await this.wrapAppFile();
    await this.handlePages();
  };

  private readonly wrapAppFile = async () => {
    const appPath = path.resolve(this.mpRoot, './app.js');
    const target = path.resolve(this.config.out, './app.js');
    const content = await fs.readFile(appPath, 'utf8');
    const wrappedContent = `export default function({ App }) {\n${formatCode(
      content,
    )}\n}`;
    return fs.writeFileSync(target, wrappedContent, { encoding: 'utf8' });
  };

  private readonly handlePages = async () => {
    await Promise.all(
      this.appConfig.pages.map(async (page) => {
        const pagePath = path.resolve(this.mpRoot, page);
        const wxml = pagePath + '.wxml';
        await transformWxml(wxml);
      }),
    );
  };

  public run = async () => {
    await this.handleSourceFiles();
  };
}

export function build(config: BuildConfig) {
  const builder = new Builder(config);
  return builder.run();
}
