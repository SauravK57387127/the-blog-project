#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

// Directories and files to ignore
const IGNORE_PATTERNS = [
    "node_modules",
    ".next",
    ".git",
    "dist",
    "build",
    ".turbo",
    "coverage",
    ".cache",
    ".vercel",
    ".env",
    ".DS_Store",
];

function shouldIgnore(itemName) {
    return IGNORE_PATTERNS.some((pattern) => itemName.includes(pattern));
}

function mapDirectory(dirPath, relativePath = "") {
    const result = {
        type: "directory",
        name: path.basename(dirPath),
        path: relativePath || ".",
        children: [],
    };

    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const item of items) {
            if (shouldIgnore(item.name)) continue;

            const fullPath = path.join(dirPath, item.name);
            const relPath = relativePath
                ? `${relativePath}/${item.name}`
                : item.name;

            if (item.isDirectory()) {
                result.children.push(mapDirectory(fullPath, relPath));
            } else if (item.isFile()) {
                const stats = fs.statSync(fullPath);
                result.children.push({
                    type: "file",
                    name: item.name,
                    path: relPath,
                    size: stats.size,
                    extension: path.extname(item.name),
                });
            }
        }

        // Sort: directories first, then files, both alphabetically
        result.children.sort((a, b) => {
            if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
    }

    return result;
}

function generateStats(data) {
    let fileCount = 0;
    let dirCount = 0;
    let totalSize = 0;
    const extensions = {};

    function traverse(node) {
        if (node.type === "file") {
            fileCount++;
            totalSize += node.size || 0;
            const ext = node.extension || "no-extension";
            extensions[ext] = (extensions[ext] || 0) + 1;
        } else if (node.type === "directory") {
            dirCount++;
            if (node.children) {
                node.children.forEach(traverse);
            }
        }
    }

    traverse(data);

    return {
        totalFiles: fileCount,
        totalDirectories: dirCount,
        totalSize,
        extensionCounts: extensions,
    };
}

// Main execution
// const projectPath = path.join(os.homedir(), 'Desktop', 'theBlogProj', 'apps', 'frontend');
const projectPath = path.join(
    os.homedir(),
    "Desktop",
    "theBlogProject",
    "apps",
    "frontend",
);
const outputPath = path.join(
    os.homedir(),
    "Desktop",
    "main-project-mapping.json",
);

console.log("Starting directory mapping...");
console.log(`Source: ${projectPath}`);
console.log(`Output: ${outputPath}`);

if (!fs.existsSync(projectPath)) {
    console.error(`Error: Project path does not exist: ${projectPath}`);
    process.exit(1);
}

const mappingData = mapDirectory(projectPath);
const stats = generateStats(mappingData);

const output = {
    generatedAt: new Date().toISOString(),
    projectPath,
    stats,
    structure: mappingData,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log("\n✓ Mapping complete!");
console.log(`\nStats:`);
console.log(`  Files: ${stats.totalFiles}`);
console.log(`  Directories: ${stats.totalDirectories}`);
console.log(`  Total Size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`\nOutput saved to: ${outputPath}`);
