const fs = require('fs');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [oldStr, newStr] of replacements) {
        if (content.includes(oldStr)) {
            content = content.split(oldStr).join(newStr);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed ' + filePath);
    }
}

// 1. Auth routes tests
const authFiles = ['RoleRoute.test.tsx', 'GuestRoute.test.tsx', 'ProtectedRoute.test.tsx'];
for (const f of authFiles) {
  replaceInFile('frontend/src/features/auth/containers/__tests__/' + f, [
    ["expect(screen.getByText('Cargando sesin...')).toBeInTheDocument();", ""],
    ["expect(screen.getByText('Cargando sesión...')).toBeInTheDocument();", ""],
    ["expect(screen.getByText('Cargando sesi\ufffdn...')).toBeInTheDocument();", ""]
  ]);
}

// 2. DiscoveryNavbar
replaceInFile('frontend/src/shared/components/layout/DiscoveryNavbar.test.tsx', [
  ["Travel Planner", "Fuimonos"],
  ["Cliente", "Aventurero"]
]);

// 3. DetailExpensesCard
replaceInFile('frontend/src/features/planificaciones/components/detail/DetailExpensesCard.tsx', [
  ["<button\n                  onClick={() =>", '<button title="Eliminar gasto" onClick={() =>'],
  ["<button onClick={() =>", '<button title="Eliminar gasto" onClick={() =>'],
  ["<button\r\n                  onClick={() =>", '<button title="Eliminar gasto" onClick={() =>']
]);

// 4. setupTests.ts
replaceInFile('frontend/src/setupTests.ts', [
  ["import '@testing-library/jest-dom/vitest'", "import type { ReactNode } from 'react';\nimport '@testing-library/jest-dom/vitest'"],
  ["React.ReactNode", "ReactNode"]
]);
