import path from 'path';

export const getFixture = name => path.resolve(process.cwd(), '__tests__/__fixtures__', name);

export const getAsar = name => path.resolve(process.cwd(), '__tests__/__fs_snapshots__', `${name}.asar`);
