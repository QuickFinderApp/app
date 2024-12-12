import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const FRONTEND_BUILD_PATH = "src/frontend_build";

export function buildFrontend() {
    const outputDir = path.join(__dirname, "../../../frontend/out");
    const targetDir = path.join(__dirname, "../../", FRONTEND_BUILD_PATH);

    try {
        // Run the build script
        execSync("npm run build", { cwd: path.join(__dirname, "../../../frontend"), stdio: "inherit" });

        // Check if output directory exists
        if (fs.existsSync(outputDir)) {
            // Remove existing contents in the target directory
            if (fs.existsSync(targetDir)) {
                fs.rmSync(targetDir, { recursive: true, force: true });
            }

            // Copy the output directory to the target directory recursively
            fs.cpSync(outputDir, targetDir, { recursive: true });

            console.log(`Successfully copied build output from ${outputDir} to ${targetDir}`);
        } else {
            console.error(`Output directory does not exist: ${outputDir}`);
            process.exit(1);
        }
    } catch (error) {
        console.error("Error building frontend:", error);
        process.exit(1);
    }
}

// If running directly as a script
if (require.main === module) {
    buildFrontend();
}