export default function (plop) {
  // Configuración del generador de módulos básico
  plop.setGenerator('module', {
    description: 'Create a new module with clean architecture structure',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (in kebab-case):',
        validate: (value) => {
          if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
            return true;
          }
          return 'Please enter a valid kebab-case name (e.g., "my-module")';
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Module description:'
      },
      {
        type: 'input',
        name: 'icon',
        message: 'Icon name from @heroicons/react/24/outline (e.g. HomeIcon, UserIcon):',
        default: 'HomeIcon'
      },
      {
        type: 'confirm',
        name: 'hasSubmenus',
        message: 'Will this module have submenus?',
        default: false
      },
      {
        type: 'input',
        name: 'submenus',
        message: 'Submenu names (comma-separated, in kebab-case):',
        when: (answers) => answers.hasSubmenus,
        filter: (input) => input.split(',').map(p => p.trim()).filter(Boolean)
      }
    ],
    actions: function(data) {
      const actions = [];
      
      console.log('\nCreando módulo:', data.name);
      
      // 1. Crear estructura básica del módulo
      actions.push({
        type: 'addMany',
        destination: 'src/features/{{dashCase name}}',
        templateFiles: 'plop-templates/module/**/*',
        base: 'plop-templates/module',
        data: data,
        force: false
      });
      
      // 2. Crear un archivo README con instrucciones
      actions.push({
        type: 'add',
        path: 'src/features/{{dashCase name}}/README.md',
        template: `# {{pascalCase name}} Module\n\n## Descripción\n\n{{description}}\n\n## Configuración\n\nPara integrar este módulo, necesitas:\n\n1. Agregar el Feature Flag en src/core/config/featureFlags.ts\n2. Agregar la entrada en menú en src/core/config/menuConfig.tsx\n3. Agregar las rutas en src/core/router/routes.tsx\n\n## Estructura\n\nEste módulo sigue la arquitectura limpia con las siguientes capas:\n\n- **domain/**: Entidades y reglas de negocio\n- **application/**: Casos de uso y lógica de aplicación\n- **presentation/**: Componentes de UI y páginas\n`
      });
      
      // 3. Si tiene submódulos, crear un archivo para cada uno
      if (data.hasSubmenus && data.submenus && data.submenus.length > 0) {
        data.submenus.forEach(submenu => {
          actions.push({
            type: 'add',
            path: `src/features/{{dashCase name}}/presentation/pages/${plop.getHelper('pascalCase')(submenu)}.tsx`,
            template: `import React from 'react';\n
export const ${plop.getHelper('pascalCase')(submenu)} = () => {\n
  return (\n
    <div className="p-6">\n
      <h1 className="text-2xl font-bold mb-4">${plop.getHelper('pascalCase')(submenu)}</h1>\n
      <p>Este es el submódulo ${plop.getHelper('pascalCase')(submenu)} del módulo ${plop.getHelper('pascalCase')(data.name)}.</p>\n
    </div>\n
  );\n
};\n`
          });
        });
      }
      
      console.log('\n✅ Se creó la estructura básica del módulo.');
      console.log('🔍 Recuerda que debes configurar manualmente:');
      console.log('  - Feature flags en src/core/config/featureFlags.ts');
      console.log('  - Menú en src/core/config/menuConfig.tsx');
      console.log('  - Rutas en src/core/router/routes.tsx');
      
      return actions;
    }
  });
  
  // Instrucciones generales
  console.log('\n💡 Generador básico de módulos');
  console.log('\nEste generador crea la estructura básica de carpetas para un nuevo módulo.');
  console.log('Deberás configurar manualmente los feature flags, menús y rutas.');
  console.log('\nPara usar, ejecuta: npm run generate module');
  console.log('Sigue el asistente interactivo para configurar tu módulo');
}; 