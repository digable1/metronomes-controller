## Move Sources (copy) to publish folder and update Sourcmap references

### Overview

This command:

1. Takes the source files in a project and copies it to a directory within the publish directory (defaults to 'dist/_src')
1. Updates the .map files within the publish directory to reference the copied source files (defaults to 'dist')

It is meant for npm packages that might be imported to frameworks where sourcemap files no longer point to the right location because the original source files
are not packages.  However, sourcemap capability is desired in projects that import your package for future debugging.

### Command-line Parameters

1. _--quiet_ (_-q_):  Suppresses all messages from this tool
1. _--help_ (_h_):  Help section

### Configuration

There are configuration options to:

1. Tell this tool how to go from the project root directory to the publish or 'dist' directory in relative path terms (defaults to 'dist')
1. Tell this tool how to get from the root directory to the publish "src" directory in relative path terms (defaults to 'dist/_src/)
1. Define the internal 'src' directory with the publish directory (defaults to '_src')
1. The extension that defines a sourcemap file (defaults to '.map')
1. Define the directory this tool resides in (defaults to 'utils')
1. Tell this tool how to get from the directory this tool resides in to the project root (defaults to '..')

_Note:_ Do not supply the ending path separators to the above configurations

The JSON default for this configuration is:

```JSON
{
    "rootToDist": "dist",
    "distSource": "_src",
    "rootToDistSrc": "dist/_src",
    "allowedFileExtension": ".map",
    "excluded": [
        "node_modules",
        "spec",
        ".git"
    ],
    "utilsDirectory": "utils",
    "utilsToRoot": ".."
}
```
