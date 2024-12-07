import fs from "fs"
import os from "os"

export function pathExists(fileOrFolderPath: string) {
    return new Promise((resolve) => fs.access(fileOrFolderPath, (error) => resolve(!error)));
}

export function getTempDirectory() {
    return os.tmpdir()
}