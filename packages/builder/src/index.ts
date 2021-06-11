import * as path from 'path';
import * as fs from 'fs-extra';
import { AppConfig, BuildConfig, ProjectConfig } from './types';
import { formatCode, getAppConfig, getProjectConfig } from './utils';
import { wxml2jsx } from './wxml';
import { ensureDirSync } from 'fs-extra';

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

  private readonly handleSourceFiles = () => {
    // this.wrapAppFile();
    this.handlePages();
  };

  private readonly wrapAppFile = () => {
    const appPath = path.resolve(this.mpRoot, './app.js');
    const target = path.resolve(this.config.out, './app.js');
    const content = fs.readFileSync(appPath, 'utf8');
    const wrappedContent = formatCode(
      `export default function() { ${content} }`,
    );
    return fs.writeFileSync(target, wrappedContent, { encoding: 'utf8' });
  };

  private readonly handlePages = () => {
    this.appConfig.pages.forEach(async (page) => {
      const pagePath = path.resolve(this.mpRoot, page);
      const wxmlPath = pagePath + '.wxml';

      const target = path.resolve(this.config.out, page);
      const wxmlTarget = target + '.wxml.js';

      const jsx = wxml2jsx(wxmlPath);
      const content = formatCode(
        `export default function(context) { with(context) { return <>${jsx}</> } }`,
      );

      // console.log({ wxmlTarget, content, target });
      ensureDirSync(path.resolve(target, '../'));
      return fs.writeFileSync(wxmlTarget, content, { encoding: 'utf8' });
    });
  };

  public run = () => {
    this.handleSourceFiles();
  };
}

export function build(config: BuildConfig) {
  const builder = new Builder(config);
  return builder.run();
}
