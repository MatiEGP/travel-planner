const fs = require('fs');

let plan = fs.readFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', 'utf8');
plan = plan.replace("it('filters trips: shows upcoming trips by default and switches to past trips when tab is clicked', () => {", "it('filters trips: shows upcoming trips by default and switches to past trips when tab is clicked', async () => {");
plan = plan.replace("it('deletes a trip when confirmed', () => {", "it('deletes a trip when confirmed', async () => {");
fs.writeFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', plan);

