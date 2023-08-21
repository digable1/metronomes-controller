import * as fs from 'fs';
import * as path from 'path';

const utilsDirectory = 'utils';

const distToRoot = '..';
const rootToDist = 'dist';
const distSource = '_src'
const rootToDistSrc = `dist/${distSource}`;
const allowedFileExtension = '.map';
const excluded = [
    'node_modules',
    'spec',
    'utils',
    '.git'
]

export function moveSourcemap(): void {
    const cwd = process.cwd();
    if (cwd.indexOf(utilsDirectory) < 0) {
        console.error(`This must be run in the ${utilsDirectory} directory`);
        process.exit(1);
    }
    process.chdir(path.resolve(distToRoot));
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
    console.log();
}

function findMapFiles(directory = rootToDist, fileExtensionFilter = allowedFileExtension): Array<fs.Dirent> {
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

const parentPath = '../';
function removeParentPaths(source: string): string {
    let currentSource = source;
    let parentPathCount = 0;

    while (currentSource.startsWith(parentPath)) {
        currentSource = currentSource.substring(parentPath.length);
        ++parentPathCount;
    }

    return currentSource;
}

function changeMapSourcesPath(mapPath: string, newSource = distSource): Object {
    const encoding = 'utf-8';
    const contents = fs.readFileSync(mapPath, { encoding: encoding });
    const mapDefinition = JSON.parse(contents);
    const sources = mapDefinition.sources as Array<string> | undefined;

    if (sources && mapPath.indexOf(newSource) < 0) {
        console.log(`    Map file '${mapPath}':`);
        for (let sourceIndex = 0; sourceIndex < sources.length; ++sourceIndex) {
            const originalSource = sources[sourceIndex];
            if (originalSource.indexOf(newSource) < 0) {
                sources[sourceIndex] = changeSourcePath(sources[sourceIndex], newSource);
            }
            console.log(`       [original] -> [new]: ${originalSource} -> ${sources[sourceIndex]}`);
        }
    }
    return mapDefinition;

    function changeSourcePath(source: string, newSource: string): string {
        const sourceWithoutParents = removeParentPaths(source);
        const parentPathCount = countParentPaths(source);
        const parentPaths = parentPathCount > 0 ? generateParentPaths(parentPathCount - 1) : '';
        const finalContents = source.indexOf(newSource) < 0 ? `${parentPaths}${newSource}/${sourceWithoutParents}` : source

        return finalContents;
    }

    function countParentPaths(source: string): number {
        let currentSource = source;
        let parentPathCount = 0;
    
        while (currentSource.startsWith(parentPath)) {
            currentSource = currentSource.substring(parentPath.length);
            ++parentPathCount;
        }
    
        return parentPathCount;
    }

    function generateParentPaths(count: number): string {
        let parentPaths = "";
        for (let pathIndex = 0; pathIndex < count; ++pathIndex) {
            parentPaths += parentPath;
        }
        return parentPaths;
    }
    
}

function copySources(mapDefinition: any, distLocation = rootToDist, newSource = distSource): void {
    const sources = mapDefinition.sources as Array<string>;

    sources.forEach((source) => {
        const sourcePath = `${removeParentPathsAndDistSourceAddParentPath(source)}`;
        const destinationPath = `${newSource}/${removeParentPaths(sourcePath)}`;
        const distDestinationPath = `${distLocation}/${destinationPath}`;
        fs.mkdirSync(getPath(distDestinationPath), { recursive: true });
        fs.copyFileSync(sourcePath, distDestinationPath, fs.constants.COPYFILE_FICLONE);
    });

    function removeParentPathsAndDistSourceAddParentPath(sourceParam: string): string {
        const sourceWithoutParents = removeParentPaths(sourceParam);
        const sourceWithoutSourcePrefixIndex = sourceWithoutParents.indexOf('/');
        return sourceWithoutParents.substring(sourceWithoutSourcePrefixIndex + 1);
    }

    function getPath(sourceParam: string): string {
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
