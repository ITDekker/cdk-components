import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import * as path from 'path';

import { PackageInfo } from './package-info';
import { execProgram } from './exec-program';
import { packDirectory } from './pack-directory';

const NAME = 'cloudcomponents';

// eslint-disable-next-line no-console
console.log(chalk.red(figlet.textSync(NAME)), '\n');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

const main = async (): Promise<void> => {
    const { argv } = yargs
        .version(version)
        .scriptName(NAME)
        .help('help')
        .command('build', 'Build a package');

    const packageInfo = await PackageInfo.createInstance();

    const command = argv._[0];

    const cwd = process.cwd();

    switch (command) {
        case 'build': {
            const lambdaDependencies = packageInfo.getLambdaDependencies();

            Object.keys(lambdaDependencies).forEach(
                async (lambdaPkg): Promise<void> => {
                    const lambdaSrc = path.join(
                        cwd,
                        'node_modules',
                        ...lambdaPkg.split('/'),
                    );
                    const lambdaDest = path.join(
                        cwd,
                        'lambda',
                        lambdaDependencies[lambdaPkg],
                    );

                    await packDirectory(lambdaSrc, lambdaDest);
                },
            );

            const compiler = packageInfo.getCompiler({ watchMode: false });
            await execProgram(compiler.command, compiler.args);
            break;
        }

        case 'watch': {
            const compiler = packageInfo.getCompiler({ watchMode: true });
            await execProgram(compiler.command, compiler.args);
            break;
        }

        default: {
            throw new Error(`Unknown command: ${command}`);
        }
    }
};

main().catch(e => {
    process.stderr.write(`${e.toString()}\n`);
    process.exit(1);
});
