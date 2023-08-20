import * as fs from 'fs';
import * as path from 'path';

const utilsDirectory = 'utils';
const toRootDirectory = '..';
const rooToDist = 'dist';
const rootToDistSrc = 'dist/_src';
const allowedFileExtension = '.map';
const excluded = [
    'node_modules',
    '.git'
]

export function moveSourcemap(): void {
    const cwd = process.cwd();
    if (cwd.indexOf(utilsDirectory) < 0) {
        console.error(`This must be run in the ${utilsDirectory} directory`);
        process.exit(1);
    }
    process.chdir(path.resolve(toRootDirectory));
    const originalDirectory = process.cwd();

    console.log(`Syncing sourcemaps:`);
    console.log(`    Original directory  : ${originalDirectory}`);
    console.log(`    Desination directory: ${originalDirectory}${rootToDistSrc}`);
    console.log();

    findMapFiles().forEach((dirEntry) => {
        const mapObject = changeMapSourcesPath(`${dirEntry.name}`);
        copySources(mapObject);
        fs.writeFileSync(`${dirEntry.name}`, JSON.stringify(mapObject), { encoding: 'utf-8' });
    });
    process.chdir(cwd);
    console.log();
    console.log(`Done`);
}

function findMapFiles(directory = rooToDist, fileExtensionFilter = allowedFileExtension): Array<fs.Dirent> {
    const newDirContents: Array<fs.Dirent> = [];
    if (!excluded.includes(directory)) {
        const dirContents = fs.readdirSync(`${directory}`, { withFileTypes: true });
        dirContents.forEach((dir) => {
            if (!dir.name.startsWith('.')) {
                if (!excluded.includes(dir.name)) {
                    if (dir.isDirectory()) {
                        newDirContents.push(...findMapFiles(`${directory}${path.sep}${dir.name}`, fileExtensionFilter));
                    } else {
                        if (dir.name.endsWith(fileExtensionFilter)) {
                            dir.name = `${path.resolve(directory)}/${dir.name}`;
                            newDirContents.push(dir);
                        }
                    }
                }
            }
        })
    }
    return newDirContents;
}

function changeMapSourcesPath(mapPath: string, newLocationFromRoot = rootToDistSrc): Object {
    const encoding = 'utf-8';
    const contents = fs.readFileSync(mapPath, { encoding: encoding });
    const mapDefinition = JSON.parse(contents);
    const sources = mapDefinition.sources as Array<string> | undefined;

    if (sources) {
        console.log(`        Map file '${mapPath}':`);
        for (let sourceIndex = 0; sourceIndex < sources.length; ++sourceIndex) {
            const originalSource = sources[sourceIndex];
            sources[sourceIndex] = changeSourcePath(sources[sourceIndex], newLocationFromRoot);
            console.log(`           [original] -> [new]: ${originalSource} -> ${sources[sourceIndex]}`);
        }
    }
    return mapDefinition;

    function changeSourcePath(source: string, newLocationFromRoot: string): string {
        const resolvedRoot = path.resolve();
        const sourceRoot = stripRelativePathComponents(source);
        const finalContents = `${newLocationFromRoot}/${sourceRoot}`;

        return finalContents;

        function stripRelativePathComponents(sourceParam: string): string {
            let strippedSourceParam = sourceParam;
            while (strippedSourceParam.startsWith('.')) {
                strippedSourceParam = movePathToParent(strippedSourceParam);
            }
            return strippedSourceParam;
        }
        function movePathToParent(sourceParam: string): string {
            const unixSeparatorIndex = sourceParam.indexOf('/');
            const dosSeparatorIndex = sourceParam.indexOf('\\');
            let separatorIndex = 0;
            if (unixSeparatorIndex > -1 && dosSeparatorIndex > -1) {
                separatorIndex = unixSeparatorIndex < dosSeparatorIndex ? unixSeparatorIndex : dosSeparatorIndex;
            } else if (unixSeparatorIndex > -1 || dosSeparatorIndex > -1) {
                separatorIndex = unixSeparatorIndex > -1 ? unixSeparatorIndex : dosSeparatorIndex;
            }
            return sourceParam.substring(separatorIndex + 1);
        }
    }
}

function copySources(mapDefinition: any, newLocationFromRoot = rootToDistSrc): void {
    const sources = mapDefinition.sources as Array<string>;
    sources.forEach((source) => {
        if (source.startsWith(`${newLocationFromRoot}/`)) {
            const originalSource = source.substring(newLocationFromRoot.length + 1);
            const originalPath = getOriginalSourcePath(originalSource);
            fs.mkdirSync(newLocationFromRoot, { recursive: true });
            if (originalPath.length > 0) {
                fs.mkdirSync(`${newLocationFromRoot}${path.sep}${originalPath}`, { recursive: true });
            }
            fs.copyFileSync(originalSource, source, fs.constants.COPYFILE_FICLONE);
        }
    });

    function getOriginalSourcePath(sourceParam: string): string {
        const lastUnixSeparatorIndex = sourceParam.lastIndexOf('/');
        const lastDosSeparatorIndex = sourceParam.lastIndexOf('\\');
        let lastSeparatorIndex = 0;
        if (lastUnixSeparatorIndex > -1 && lastDosSeparatorIndex > -1) {
            lastSeparatorIndex = lastUnixSeparatorIndex < lastDosSeparatorIndex ? lastUnixSeparatorIndex : lastDosSeparatorIndex;
        } else if (lastUnixSeparatorIndex > -1 || lastDosSeparatorIndex > -1){
            lastSeparatorIndex = lastUnixSeparatorIndex > -1  ? lastUnixSeparatorIndex : lastDosSeparatorIndex;
        }
        const sourcePath = sourceParam.substring(0, lastSeparatorIndex);
        return sourcePath;
    }
}

moveSourcemap();
