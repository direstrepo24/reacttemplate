#!/usr/bin/env node

/**
 * Script to fix TodoList component imports and styling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(path.join(__dirname, '..', '..'));

// TodoList.tsx path
const todoListPath = path.join(projectRoot, 'src', 'features', 'todo', 'presentation', 'TodoList.tsx');

// Fix the TodoList.tsx file
const fixTodoList = () => {
  if (!fs.existsSync(todoListPath)) {
    console.error(`TodoList.tsx not found at ${todoListPath}`);
    return;
  }

  let content = fs.readFileSync(todoListPath, 'utf8');
  
  // Replace relative paths with absolute paths using aliases
  content = content.replace(
    /import\s+{[^}]*}\s+from\s+['"]\.\.\/domain\/Todo['"]/g,
    "import { Todo } from '@features/todo/domain/Todo'"
  );
  
  content = content.replace(
    /import\s+{[^}]*}\s+from\s+['"]\.\.\/domain\/TodoBuilder['"]/g,
    "import { createTodoBuilder } from '@features/todo/domain/TodoBuilder'"
  );
  
  // Replace classnames with cn utility
  content = content.replace(
    /import\s+cn\s+from\s+['"]classnames['"]/g,
    "import { cn } from '@core/utils/cn'"
  );
  
  // Add FeatureFlags import and use enum instead of string
  if (!content.includes('FeatureFlags')) {
    content = content.replace(
      /import\s+{[^}]*useFeatureFlag[^}]*}\s+from\s+['"][^'"]+['"]/g,
      match => match + "\nimport { FeatureFlags } from '@core/config/featureFlags'"
    );
    
    // Replace useFeatureFlag(FeatureFlags.USE_NEUMORPHISM) with useFeatureFlag(FeatureFlags.USE_NEUMORPHISM)
    content = content.replace(
      /useFeatureFlag\(['"]USE_NEUMORPHISM['"]\)/g,
      "useFeatureFlag(FeatureFlags.USE_NEUMORPHISM)"
    );
  }
  
  // Replace Tailwind classes with standard CSS classes
  content = content.replace(
    /className="base-text/g,
    'className="font-size-base'
  );
  
  // Fix the import path for useFeatureFlag
  content = content.replace(
    /import\s+{[^}]*useFeatureFlag[^}]*}\s+from\s+['"][^@][^'"]+['"]/g,
    "import { useFeatureFlag } from '@core/hooks/useFeatureFlag'"
  );

  fs.writeFileSync(todoListPath, content, 'utf8');
  console.log('Successfully updated TodoList.tsx');
};

// Run the fix
fixTodoList(); 