import * as path from 'path';
import * as fs from 'fs-extra';

export interface Compiler {
    readonly command: string;
    readonly args: ReadonlyArray<string>;
}

export interface PackageJson {
    readonly name: string;
    readonly version?: string;
    readonly private?: boolean;
    readonly description?: string;
    readonly keywords?: string[];
    readonly homepage?: string;
    readonly license?: string;
    readonly files?: string[];
    readonly main?: string;
    readonly bin?: string | Record<string, string>;
    readonly scripts?: Record<string, string>;
    readonly dependencies?: Record<string, string>;
    readonly devDependencies?: Record<string, string>;
    readonly peerDependencies?: Record<string, string>;
    readonly optionalDependencies?: Record<string, string>;
    readonly bundledDependencies?: string[];

    // custom
    readonly jsii?: any;
    readonly lambdaDependencies?: Record<string, string>;
}

export class PackageInfo {
    constructor(private readonly pkgJson: PackageJson) {}

    public isJsii(): boolean {
        return this.pkgJson.jsii !== undefined;
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

    public getLambdaDependencies(): Record<string, string> | undefined {
        return this.pkgJson.lambdaDependencies;
    }

    public static async createInstance(): Promise<PackageInfo> {
        const cwd = process.cwd();

        const pkgJson = JSON.parse(
            await fs.readFile(path.join(cwd, 'package.json'), 'utf8'),
        );

        return new PackageInfo(pkgJson);
    }
}
