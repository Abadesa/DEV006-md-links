const fs = require("fs");
const path = require("path");
const axios = require("axios");
const {
  checkPath,
  itsAbsolute,
  convertAbsolute,
  verifyRouteType,
  extensionCheck,
  readMD,
  extractLinks,
  validateLinks,
} = require("../scr/functions");

describe("checkPath", () => {
  test("debe resolver con la ruta si existe", () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    return expect(checkPath(route)).resolves.toBe(route);
  });

  test("debe rechazar con un mensaje de error si la ruta no existe", () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\noExiste.md";
    return expect(checkPath(route)).rejects.toMatch("La ruta no existe");
  });
});

describe("itsAbsolute", () => {
  test("debe resolverse con la ruta absoluta si aún no es absoluta", () => {
    const route = "test\\prueba.md";
    const expectedAbsoluteRoute = path.resolve(route);
    return expect(itsAbsolute(route)).resolves.toBe(expectedAbsoluteRoute);
  });

  test("debe resolverse con la ruta original si ya es absoluta", () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    return expect(itsAbsolute(route)).resolves.toBe(route);
  });
});

describe("convertAbsolute", () => {
  test("debe resolver con la ruta absoluta", () => {
    const route = "test\\prueba.md";
    const expectedAbsoluteRoute = path.resolve(route);
    return expect(convertAbsolute(route)).resolves.toBe(expectedAbsoluteRoute);
  });
});

describe('verifyRouteType', () => {
  test('debería resolver con "archivo" si la ruta es un archivo', () => {
    const route = 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md';
    return expect(verifyRouteType(route)).resolves.toBe('archivo');
  });

  test('debería resolver con "directorio" si la ruta es un directorio', () => {
    const route = 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test';
    return expect(verifyRouteType(route)).resolves.toBe('directorio');
  });

  test('debería rechazar con un mensaje de error si la ruta no es un archivo ni un directorio', () => {
    const route = 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\noExiste.md';
    return expect(verifyRouteType(route)).rejects.toThrowError('La ruta no es ni un archivo ni un directorio');
  });
});


describe("extensionCheck", () => {
  test('debe resolverse con true si la extensión del archivo es ".md"', () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    return expect(extensionCheck(route)).resolves.toBe(true);
  });

  test('debería resolverse con false si la extensión del archivo no es ".md"', () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.txt";
    return expect(extensionCheck(route)).resolves.toBe(false);
  });
});

describe("readMD", () => {
  test("debe resolverse con el contenido del archivo como un string", () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    const expectedContent = "Lorem ipsum dolor sit amet";
    fs.readFile = jest.fn((path, encoding, callback) => {
      callback(null, expectedContent);
    });
    return expect(readMD(route)).resolves.toBe(expectedContent);
  });

  test("debe rechazar con un error si hubo un error al leer el archivo", () => {
    const route =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    const expectedError = new Error("File not found");
    fs.readFile = jest.fn((path, encoding, callback) => {
      callback(expectedError);
    });
    return expect(readMD(route)).rejects.toBe(expectedError);
  });
});

describe("extractLinks", () => {
  test("debe extraer enlaces del contenido y devolver un array de objetos de enlace", () => {
    const content =
      "[Google](https://www.google.com) [OpenAI](https://openai.com)";
    const filePath =
      "C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\prueba.md";
    const expectedLinks = [
      { href: "https://www.google.com", text: "Google", file: filePath },
      { href: "https://openai.com", text: "OpenAI", file: filePath },
    ];
    expect(extractLinks(content, filePath)).toEqual(expectedLinks);
  });
});

describe('validateLinks', () => {
  test('debería devolver un array de objetos con los enlaces validados', () => {
    const links = [
      {
        href: 'https://nodejs.org/',
        text: 'Node',
        file: 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\pruebaRoto.md'
      },
      {
        href: 'https//developers.google./v8/',
        text: 'motor de JavaScript V8 de Chrome',
        file: 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\pruebaRoto.md'
      }
    ];
    // Aquí puedes simular las respuestas de los enlaces utilizando una biblioteca como nock o jest-fetch-mock
    const expected = [
      {
        href: 'https://nodejs.org/',
        text: 'Node',
        file: 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\pruebaRoto.md',
        status: 200,
        ok: 'OK'
      },
      {
        href: 'https//developers.google./v8/',
        text: 'motor de JavaScript V8 de Chrome',
        file: 'C:\\Users\\alici\\OneDrive\\Escritorio\\Proyectos Front End\\DEV006-md-links\\test\\pruebaRoto.md',
        status: null,
        ok: 'fail'
      }
    ];

    return validateLinks(links).then(result => {
      expect(result).toEqual(expected);
    });
  });
});