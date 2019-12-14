import * as path from 'path';
import * as fs from 'fs-extra';

export interface Compiler {
    command: string;
    args: ReadonlyArray<string>;
}

export class PackageInfo {
    constructor(private readonly pkgInfo: Record<string, any>) {}

    public isJsii(): boolean {
        return this.pkgInfo.jsii !== undefined;
    }

    public getCompiler({ watchMode }: { watchMode?: boolean }): Compiler {
        const args = watchMode ? ['-w'] : [];

        if (this.isJsii()) {
            return {
                command: require.resolve('jsii/bin/jsii'),
                args: [...args, '--project-references'],
            };
        }

        return {
            command: require.resolve('typescript/bin/tsc'),
            args: [...args],
        };
    }

    public getLambdaDependencies() {
        return this.pkgInfo.lambdaDependencies;
    }

    public static async createInstance(): Promise<PackageInfo> {
        const cwd = process.cwd();

        const pkgInfo = JSON.parse(
            await fs.readFile(path.join(cwd, 'package.json'), 'utf8'),
        );

        return new PackageInfo(pkgInfo);
    }
}
