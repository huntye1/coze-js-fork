import path from 'path';

import { isFileExists } from '@coze-infra/fs-enhance';

import { type AuditRule, type AuditDetectResult } from '../types';

const defaultEssentialFiles = ['eslint.config.js', 'tsconfig.json', 'OWNERS'];

// 以上这些文件都必须存在
export const checkEssentialConfigFiles: AuditRule<{
  essentialFiles?: string[];
}> = {
  name: 'essential-config-file',
  async fn(project, config?) {
    const { projectFolder } = project;
    const essentialFiles = config?.essentialFiles || defaultEssentialFiles;
    return (
      await Promise.all(
        // @ts-expect-error -- ignore
        essentialFiles.map(async (file: string): Promise<AuditDetectResult> => {
          const filePath = path.resolve(projectFolder, file);
          const exists = await isFileExists(filePath);

          if (!exists) {
            return {
              content: `\`${path.basename(
                file,
              )}\` does not exist, please add it to your package.`,
            };
          }
        }),
      )
    ).filter(r => !!r);
  },
};