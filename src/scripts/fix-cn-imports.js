#!/usr/bin/env node

/**
 * Script to replace classnames with cn utility across the project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(path.join(__dirname, '..', '..'));

// Find all TypeScript/JavaScript files in src
const findFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

// Process a file to replace classnames with cn
const processFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace import statements
    const importRegex = /import\s+cn\s+from\s+['"]classnames['"]/g;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, "import { cn } from '@core/utils/cn'");
      modified = true;
    }

    // Replace direct imports of classnames
    const classNamesRegex = /import\s+.*\s+from\s+['"]classnames['"]/g;
    if (classNamesRegex.test(content)) {
      content = content.replace(classNamesRegex, "import { cn } from '@core/utils/cn'");
      modified = true;
    }

    // Replace instances of cn( with cn(
    const classNamesFnRegex = /classNames\(/g;
    if (classNamesFnRegex.test(content)) {
      content = content.replace(classNamesFnRegex, "cn(");
      modified = true;
    }

    // Replace className="base-text with something compatible
    const textBaseRegex = /className="base-text/g;
    if (textBaseRegex.test(content)) {
      content = content.replace(textBaseRegex, 'className="base-text');
      modified = true;
    }

    // Save changes if the file was modified
    if (modified) {
      console.log(`Fixing cn imports in ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
};

// Main execution
const main = () => {
  console.log('Starting cn import fixer...');
  
  const srcDir = path.join(projectRoot, 'src');
  const files = findFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript/JavaScript files`);
  
  let fixedCount = 0;
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed cn imports in ${fixedCount} files`);
};

main(); 