// move-files.js
const fs = require('fs');
const path = require('path');

// 源目录（public）
const sourceDir = path.join(process.cwd(), 'public');

// 目标目录（out 或 dist）
const targetDir = path.join(process.cwd(), 'out');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}


fs.readdirSync(sourceDir).forEach(file => {
    if (file !== "robots.txt" && !file.startsWith("sitemap")) {
        return;
    }
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.existsSync(sourcePath)) {
        fs.renameSync(sourcePath, targetPath);
        console.log(`Moved ${file} to ${targetDir}`);
    } else {
        console.warn(`${file} not found in ${sourceDir}`);
    }
})