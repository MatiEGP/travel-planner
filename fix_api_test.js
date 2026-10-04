const fs = require('fs');

let api = fs.readFileSync('frontend/src/shared/api/__tests__/apiServices.test.ts', 'utf8');
api = api.replace("apiClient: {", "setAccessToken: vi.fn(),\n  apiClient: {");
fs.writeFileSync('frontend/src/shared/api/__tests__/apiServices.test.ts', api);

