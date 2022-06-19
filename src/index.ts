import { createWriteStream, unlinkSync } from "fs";

try {
  unlinkSync('.env');
  unlinkSync('firebase.ts');
} catch (error) {
  console.log('not exists or some other error');
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const firebaseConfig = {
  /* replace with real data */
};

const envStream = createWriteStream('.env');
envStream.once('open', () => {
  Object.keys(firebaseConfig).forEach((key) => {
    const k = key as keyof typeof firebaseConfig;
    envStream.write(`VITE_APP_${camelToSnakeCase(k).toUpperCase()}=${firebaseConfig[k]}\n`);
  });
  envStream.end();
});


const v = Object.keys(firebaseConfig).reduce((prev, curr) => {
  return {...prev, [curr]: `VITE_APP_${camelToSnakeCase(curr).toUpperCase()}` };
}, {});

const tsStream = createWriteStream('firebase.ts');
tsStream.once('open', () => {
  tsStream.write('const firebaseConfig = {\n');
  Object.keys(v).forEach((key) => {
    const k = key as keyof typeof v;
    tsStream.write(`  ${k}: import.meta.env.${v[k]}\n`);
  })
  tsStream.write('};\n');
  tsStream.end();
})