#!/usr/bin/env node

/**
 * Script to fix all imports in the project to use path aliases
 * Run with: node src/scripts/fix-all-imports.js
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

// Patterns for import replacements
const importPatterns = [
  // Core
  { 
    regex: /from\s+['"]\.\.\/\.\.\/core\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/core\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/core\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/${p1}'`
  },
  
  // Components
  { 
    regex: /from\s+['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@components/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@components/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@components/${p1}'`
  },
  
  // Features
  { 
    regex: /from\s+['"]\.\.\/\.\.\/features\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@features/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/features\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@features/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/features\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@features/${p1}'`
  },
  
  // Utils
  { 
    regex: /from\s+['"]\.\.\/\.\.\/utils\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/utils/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/utils\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/utils/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/utils\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/utils/${p1}'`
  },
  
  // Hooks
  { 
    regex: /from\s+['"]\.\.\/\.\.\/hooks\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/hooks/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/hooks\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/hooks/${p1}'`
  },
  { 
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/hooks\/([^'"]+)['"]/g, 
    replacement: (match, p1) => `from '@core/hooks/${p1}'`
  },
  
  // Specific replacements - for cases like FlagFlagsUtil and others in multiple places
  {
    regex: /from\s+['"]classnames['"]/g,
    replacement: `from '@core/utils/cn'`
  },
  {
    regex: /import\s+cn\s+from\s+['"][^'"]+['"]/g,
    replacement: `import { cn } from '@core/utils/cn'`
  }
];

// Process a file to fix imports
const processFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply all patterns
    importPatterns.forEach(pattern => {
      const originalContent = content;
      content = content.replace(pattern.regex, pattern.replacement);
      if (originalContent !== content) {
        modified = true;
      }
    });

    // Fix FeatureFlags import and usage
    if (content.includes('useFeatureFlag')) {
      let needsFeatureFlagsImport = false;
      
      // Convert string literals to enum usage in useFeatureFlag calls
      const featureFlagRegex = /useFeatureFlag\(['"]([A-Z_]+)['"]\)/g;
      const updatedContent = content.replace(featureFlagRegex, (match, flagName) => {
        needsFeatureFlagsImport = true;
        return `useFeatureFlag(FeatureFlags.${flagName})`;
      });
      
      if (updatedContent !== content) {
        content = updatedContent;
        modified = true;
        
        // Add FeatureFlags import if needed
        if (needsFeatureFlagsImport && !content.includes('FeatureFlags')) {
          if (content.includes('useFeatureFlag') && content.includes('from \'@core/hooks/useFeatureFlag\'')) {
            content = content.replace(
              /import\s+{\s*useFeatureFlag\s*}\s+from\s+['"]@core\/hooks\/useFeatureFlag['"]/g,
              `import { useFeatureFlag } from '@core/hooks/useFeatureFlag';\nimport { FeatureFlags } from '@core/config/featureFlags'`
            );
            modified = true;
          }
        }
      }
    }

    // Save changes if the file was modified
    if (modified) {
      console.log(`Fixing imports in ${path.relative(projectRoot, filePath)}`);
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
  console.log('Starting comprehensive import path fixer...');
  
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