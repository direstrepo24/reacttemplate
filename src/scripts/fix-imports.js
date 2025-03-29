#!/usr/bin/env node

/**
 * Script to scan the project for import errors and fix them
 * Run with: node src/scripts/fix-imports.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common import patterns that should use path aliases
const patterns = [
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/core\/hooks\/useFeatureFlag['"]/g, 
    replacement: 'from \'@core/hooks/useFeatureFlag\''
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/hooks\/useFeatureFlag['"]/g, 
    replacement: 'from \'@core/hooks/useFeatureFlag\''
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/core\/utils\/cn['"]/g, 
    replacement: 'from \'@core/utils/cn\''
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/utils\/cn['"]/g, 
    replacement: 'from \'@core/utils/cn\''
  },
  { 
    regex: /from\s+['"]classnames['"]/g, 
    replacement: 'from \'@core/utils/cn\''
  },
  { 
    regex: /import\s+cn\s+from\s+['"].*['"]/g, 
    replacement: 'import { cn } from \'@core/utils/cn\''
  },
  {
    regex: /useFeatureFlag\(['"]([A-Z_]+)['"]\)/g,
    replacement: 'useFeatureFlag(FeatureFlags.$1)'
  },
  {
    regex: /from\s+['"]\.\.\/domain\/Todo['"]/g,
    replacement: 'from \'@features/todo/domain/Todo\''
  },
  {
    regex: /from\s+['"]\.\.\/domain\/TodoBuilder['"]/g,
    replacement: 'from \'@features/todo/domain/TodoBuilder\''
  }
];

// Add FeatureFlags import if useFeatureFlag is used
const addFeatureFlagsImport = (content) => {
  if (content.includes('useFeatureFlag') && !content.includes('FeatureFlags')) {
    return content.replace(
      /import.*useFeatureFlag.*;\n/,
      match => match + 'import { FeatureFlags } from \'@core/config/featureFlags\';\n'
    );
  }
  return content;
};

// Convert cn import from classnames to our utility
const convertCnImport = (content) => {
  if (content.includes('import { cn } from '@core/utils/cn'"].*['"]/g,
      'import { cn } from \'@core/utils/cn\''
    );
  }
  return content;
};

// Process a file to fix its imports
const processFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply all patterns
    patterns.forEach(pattern => {
      const before = content;
      content = content.replace(pattern.regex, pattern.replacement);
      if (before !== content) {
        modified = true;
      }
    });

    // Apply additional transforms
    const withFeatureFlags = addFeatureFlagsImport(content);
    const withCnUtility = convertCnImport(withFeatureFlags);
    
    if (withCnUtility !== content) {
      modified = true;
      content = withCnUtility;
    }

    // Save changes if the file was modified
    if (modified) {
      console.log(`Fixing imports in ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
};

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

// Main execution
const main = () => {
  console.log('Starting import path fixer...');
  
  // Get the src directory by going up from current script
  const projectRoot = path.resolve(path.join(__dirname, '..', '..'));
  const srcDir = path.join(projectRoot, 'src');
  
  const files = findFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript/JavaScript files`);
  
  let fixedCount = 0;
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed imports in ${fixedCount} files`);
};

main(); 