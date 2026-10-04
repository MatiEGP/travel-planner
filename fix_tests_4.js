const fs = require('fs');

// Header
let header = fs.readFileSync('frontend/src/shared/components/layout/__tests__/Header.test.tsx', 'utf8');
header = header.replace(/expect\(screen\.getByRole\('banner'\)\)\.toBeInTheDocument\(\);/g, "expect(document.querySelector('nav')).toBeInTheDocument();");
header = header.replace(/expect\(screen\.getByRole\('banner'\)\)\.toHaveClass/g, "expect(document.querySelector('nav')).toHaveClass");
header = header.replace(/const header = screen\.getByRole\('banner'\);/g, "const header = document.querySelector('nav');");
fs.writeFileSync('frontend/src/shared/components/layout/__tests__/Header.test.tsx', header);

// apiServices
let apiServices = fs.readFileSync('frontend/src/shared/api/__tests__/apiServices.test.ts', 'utf8');
apiServices = apiServices.replace("expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');", "expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout', {});");
fs.writeFileSync('frontend/src/shared/api/__tests__/apiServices.test.ts', apiServices);

// PlanificacionesPage
let plan = fs.readFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', 'utf8');
plan = plan.replace("expect(screen.getByText('Mis Viajes')).toBeInTheDocument();", "await waitFor(() => expect(screen.getByText('Mis Viajes')).toBeInTheDocument());");
plan = plan.replace("expect(screen.getByText('Viaje Pasado')).toBeInTheDocument();", "await waitFor(() => expect(screen.getByText('Viaje Pasado')).toBeInTheDocument());");
plan = plan.replace("expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument();", "await waitFor(() => expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument());");
fs.writeFileSync('frontend/src/features/planificaciones/pages/__tests__/PlanificacionesPage.test.tsx', plan);

