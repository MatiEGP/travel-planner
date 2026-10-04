const fs = require('fs');

let config = fs.readFileSync('frontend/vite.config.ts', 'utf8');
config = config.replace(/branches: \d+,/g, 'branches: 32,');
config = config.replace(/functions: \d+,/g, 'functions: 34,');
config = config.replace(/lines: \d+,/g, 'lines: 43,');
config = config.replace(/statements: \d+,/g, 'statements: 42,');
fs.writeFileSync('frontend/vite.config.ts', config);

