const fs = require('fs');

let p = fs.readFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', 'utf8');
p = p.replace("await waitFor(() => {\n      await waitFor(() => expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument());\n    });", "await waitFor(() => expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument());");
p = p.replace("await waitFor(() => {\n      await waitFor(() => expect(screen.getByText('Viaje Pasado')).toBeInTheDocument());\n    });", "await waitFor(() => expect(screen.getByText('Viaje Pasado')).toBeInTheDocument());");
p = p.replace("await waitFor(() => {\r\n      await waitFor(() => expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument());\r\n    });", "await waitFor(() => expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument());");
p = p.replace("await waitFor(() => {\r\n      await waitFor(() => expect(screen.getByText('Viaje Pasado')).toBeInTheDocument());\r\n    });", "await waitFor(() => expect(screen.getByText('Viaje Pasado')).toBeInTheDocument());");

fs.writeFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', p);
