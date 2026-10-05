const fs = require('node:fs/promises');
const path = require('node:path');
const CleanCSS = require('clean-css');
const { minify: minifyJavaScript } = require('terser');

const root = path.resolve(__dirname, '..');
const sourceDirectories = ['components', 'scripts', 'styles'];

async function findSourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? findSourceFiles(entryPath)
        : /\.(?:css|js)$/.test(entry.name) && !/\.min\.(?:css|js)$/.test(entry.name)
          ? [entryPath]
          : [];
    })
  );
  return files.flat();
}

async function build() {
  const files = (
    await Promise.all(sourceDirectories.map((directory) => findSourceFiles(path.join(root, directory))))
  ).flat();

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const isCss = file.endsWith('.css');
    const output = isCss
      ? new CleanCSS({ level: 2, inline: [] }).minify(source)
      : await minifyJavaScript(source);

    if (output.errors?.length) {
      throw new Error(`${path.relative(root, file)}: ${output.errors.join('; ')}`);
    }

    const destination = file.replace(/\.(css|js)$/, '.min.$1');
    await fs.writeFile(destination, isCss ? output.styles : output.code);
    console.log(path.relative(root, destination));
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
