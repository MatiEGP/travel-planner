const fs = require('fs');
let p = 'frontend/src/features/planificaciones/components/detail/DetailExpensesCard.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace('type="button"\n                    onClick={() =>', 'title="Eliminar gasto"\n                      type="button"\n                    onClick={() =>');
c = c.replace('type="button"\r\n                    onClick={() =>', 'title="Eliminar gasto"\r\n                      type="button"\r\n                    onClick={() =>');
fs.writeFileSync(p, c);
