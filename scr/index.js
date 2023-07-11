const {
  checkPath,
  itsAbsolute,
  convertAbsolute,
  verifyRouteType,
  extensionCheck,
  readMD,
  extractLinks,
  validateLinks
} = require('./functions.js');

const mdLinks = (path, options) => {
  let filepath; // Variable global para almacenar el filepath

  return new Promise((resolve, reject) => {
    itsAbsolute(path)
      .then((absolutePath) => {
        filepath = absolutePath; // Asignar el valor del filepath a la variable global
        return checkPath(absolutePath);
      })
      .then((path) => {
        return extensionCheck(path);
      })
      .then((isMD) => {
        if (!isMD) {
          throw new Error('La extensión del archivo no es .md');
        }
        return verifyRouteType(path);
      })
      .then((routeType) => {
        console.log('Tipo de ruta:', routeType);

        return readMD(path);
      })
      .then((data) => {
        const resultLinks = extractLinks(data, filepath);
  

        if (options && options.validate) {
          return validateLinks(resultLinks)
            .then((validatedLinks) => {
              return validatedLinks;
            })
            .catch((error) => {
              console.error('Error en la validación de los enlaces:', error);
              return resultLinks;
            });
        } else {
          return resultLinks;
        }
      })
      .then((links) => {
        return resolve(links);
      })
      .catch((error) => {
        console.error(error);
        return reject('Esto está fallando');
      });
  });
};

const path = 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\README.md';
const options = { validate: true };

mdLinks(path, options)
  .then((data) => {
    if (Array.isArray(data)) {
      console.log('Data', data);
    } else {
      console.log('Error: El resultado no es un arreglo');
    }
  })
  .catch((error) => {
    console.log('error', error);
  });
