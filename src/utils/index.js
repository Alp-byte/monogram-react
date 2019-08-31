import { load } from 'opentype.js';
import { CANVAS_FORMAT_DXF, CANVAS_FORMAT_EPS } from '../constants';

import axios from 'axios';
import {
  scale,
  rotate,
  translate,
  transform,
  toCSS
} from 'transformation-matrix';
import trimCanvas from 'trim-canvas';
import { canvasToBlob, blobToBase64String } from 'blob-util';
export const isOnline = () => {
  if (window && 'navigator' in window) {
    return window.navigator.onLine;
  }
  return true;
};

export const removeDuplicateQuery = history => {
  const searchParams = new URLSearchParams(history.location.search);
  for (var key of searchParams.keys()) {
    console.log(key);
  }
};

export const setQuery = (querys, history) => {
  const searchParams = new URLSearchParams(history.location.search);
  if (querys) {
    for (let key in querys) {
      if (searchParams.has(key)) {
        searchParams.set(key, querys[key]);
      } else {
        searchParams.append(key, querys[key]);
      }
    }

    history.push({
      search: `?${searchParams.toString()}`
    });
  }
};

export const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const deleteQuery = (querys, history) => {
  if (querys.length) {
    const searchParams = new URLSearchParams(history.location.search);
    querys.forEach(query => {
      if (searchParams.has(query)) {
        searchParams.delete(query);
      }
    });
    history.push({
      search: `?${searchParams.toString()}`
    });
  }
};

export const readFileAsync = file => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = event => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
};

export const base64String = arrayBuffer =>
  btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

//https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
const roundTo = (n, digits = 2) => {
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  const test = Math.round(n) / multiplicator;
  return +test.toFixed(2);
};

const NUMERIC_REGEXP = /[+-]?[0-9]+(\.[0-9]+)?([Ee][+-]?[0-9]+)?/g;

export const validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
export const getNewMatrix = (matrix, oldData) => {
  let newData;
  if (typeof matrix === 'string') {
    const matrixArrValues = matrix.match(NUMERIC_REGEXP);

    // matrixArrValues.length = matrixArrValues.length - 1;

    // let numberCharsCount = 0;
    // let value = '';
    // const result = [];
    // for (let i = 0; i <= matrixArrValues.length; i++) {
    //   const element = matrixArrValues[i];
    //   if (element === ',' || i === matrixArrValues.length) {
    //     numberCharsCount = 0;
    //     result.push(value);
    //     value = '';
    //   } else if (
    //     numberCharsCount < 7 &&
    //     (Number(element) ||
    //       Number(element) === 0 ||
    //       (element === '-' && typeof matrixArrValues[i - 1] !== 'number') ||
    //       element === '.')
    //   ) {
    //     numberCharsCount++;
    //     value = value + element;
    //   }
    // }

    newData = {
      x: Number(matrixArrValues[4]),
      y: Number(matrixArrValues[5]),
      angle1: Number(matrixArrValues[1]),
      angle2: Number(matrixArrValues[2]),
      scaleX: Number(matrixArrValues[0]),
      scaleY: Number(matrixArrValues[3])
    };
  }
  if (typeof matrix === 'object') {
    newData = matrix;
  }

  if (oldData) {
    return { ...oldData, ...newData };
  }

  return newData;
};

export const getStringMatrix = matrix => {
  if (typeof matrix === 'undefined') {
    return new Error('undefined');
  }
  const { x, y } = matrix;
  const scaleX = matrix.scaleX || 1;
  const scaleY = matrix.scaleY || 1;
  return `matrix(${scaleX},0,0,${scaleY},${x},${y})`;
};

export const styler = ({
  x,
  y,
  angle,
  scaleX,
  scaleY,
  width,
  height,
  disableScale = false
}) => {
  const changedWidth = width * (1 - scaleX);
  const newWidth = width - changedWidth;
  const changedHeight = height * (1 - scaleY);
  const newHeight = height - changedHeight;

  let transformMatrix;

  if (disableScale === false) {
    transformMatrix = transform(
      translate(roundTo(x + changedWidth / 2), roundTo(y + changedHeight / 2)),
      rotate(angle * (Math.PI / 180)),
      scale(scaleX, scaleY)
    );
  } else {
    transformMatrix = transform(
      translate(roundTo(x + changedWidth), roundTo(y + changedHeight)),
      rotate(angle * (Math.PI / 180))
    );
    width = newWidth;
    height = newHeight;
  }

  return {
    element: {
      width,
      height,
      transform: toCSS(transformMatrix),
      position: 'absolute'
    },
    controls: {
      width: newWidth,
      height: newHeight,
      transform: toCSS(
        transform(
          translate(roundTo(x + changedWidth), roundTo(y + changedHeight)),
          rotate(angle * (Math.PI / 180))
        )
      ),
      position: 'absolute'
    }
  };
};

export const API_URL = process.env.REACT_APP_API_URL;

export const loadFont = fontName =>
  new Promise((resolve, reject) => {
    load(`/static/media/${fontName}.otf`, (error, font) => {
      if (error) {
        reject(`Failed to load ${fontName}.otf. ${error}`);
        return;
      }
      resolve(font);
      // console.log(font.getPath('foo').toSVG())
    });
  });

export const dualMirrorText = text =>
  `${text[0] ? text[0].toUpperCase() : ''}${
    text[1] ? text[1].toLowerCase() : ''
  }`;

export const downloadFileViaTextContent = ({ fileName, content, format }) => {
  let element = document.createElement('a');
  element.setAttribute('href', `data:${format},${content}`);
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const DownloadEspFile = async (svg, extension) => {
  const endpoints = {
    [CANVAS_FORMAT_DXF]: 'svgToDxf',
    [CANVAS_FORMAT_EPS]: 'svgToEps'
  };
  const config = {
    responseType: 'blob',
    headers: { 'content-type': 'multipart/form-data' }
  };
  try {
    const form = new FormData();
    form.append('file', svg);

    const response = await request({
      method: 'POST',
      url: `/${endpoints[extension]}`,
      data: form,
      config
    });
    return response;
  } catch (e) {
    return false;
  }
};

const client = axios.create({
  baseURL: `${document.location.protocol}//${document.location.host}/monogram/api/`
});

/**
 * Request Wrapper with default success/error actions
 */
export const request = function(options) {
  const onSuccess = function(response) {
    console.debug('Request Successful!', response);
    return response.data;
  };

  const onError = function(error) {
    console.error('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export const downloadFileViaUrl = ({ fileName, url }) => {
  let element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const generatePreview = (
  svgData,
  canvasWidth,
  canvasHeight,
  isMobile
) => {
  return new Promise(resolve => {
    var canvas = document.createElement('canvas');
    // get svg data

    const ctx = canvas.getContext('2d');

    const image = document.createElement('img');
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    canvas.setAttribute('width', isMobile ? 1548 : 4548);
    canvas.setAttribute('height', isMobile ? 1548 : 4548);
    image.addEventListener(
      'load',
      () => {
        ctx.drawImage(
          image,
          0,
          0,

          canvasWidth,
          canvasHeight,
          0,
          0,
          canvasWidth,
          canvasHeight
        );

        // HERE NEED TO TRANSFROM CANVAS TO BLOB
        trimCanvas(canvas);
        canvasToBlob(canvas, 'image/png').then(blob => {
          blobToBase64String(blob)
            .then(function(base64String) {
              resolve(base64String);
            })
            .catch(function(err) {
              console.log(err);
            });
        });
      },
      {
        once: true
      }
    );
    image.src = url;
  });
};
export const getCanvasBlob = (layers, canvasWidth, canvasHeight) => {
  // FILTER TO CLEAR EMPTY

  const layersCopy = layers.filter(layer => layer.target !== 'temp');
  const htmlSVGArray = layersCopy.map(layer => {
    const a = layer.angle;
    if (layer.target === 'frame' && !layer.isBackground) {
      const domNodeCore = document.querySelector(`#frameSvg_${layer.id} svg`);
      const domNode = domNodeCore.cloneNode(true);
      const {
        controls: { width, height, transform: transformControls }
      } = styler({
        x: layer.position.x,
        y: layer.position.y,
        scaleX: layer.scaleX,
        scaleY: layer.scaleY,
        width: layer.width,
        height: layer.height,
        angle: layer.angle
      });

      const rr = getNewMatrix(transformControls);

      domNode.setAttribute('preserveAspectRatio', 'none');
      domNode.setAttribute('width', width);
      domNode.setAttribute('height', height);
      domNode.setAttribute('x', rr.x);
      domNode.setAttribute('y', rr.y);
      domNode.setAttribute('id', domNodeCore.getAttribute('id'));
      return `<g transform="rotate(${a} ${rr.x + width / 2} ${rr.y +
        height / 2})">${domNode.outerHTML}</g>`;
    }

    if (layer.target === 'frame' && layer.isBackground) {
      const {
        controls: { width, height, transform: transformControls }
      } = styler({
        x: layer.position.x,
        y: layer.position.y,
        scaleX: layer.scaleX,
        scaleY: layer.scaleY,
        width: layer.width,
        height: layer.height,
        angle: layer.angle
      });

      const rr = getNewMatrix(transformControls);
      const svgString = `
      <svg
        width="${width}"
        height="${height}"
        x="${rr.x}"
        y="${rr.y}"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink:href="http://www.w3.org/1999/xlink"
        preserveAspectRatio="none"
        id="${layer.id}"
      >
        <image
          preserveAspectRatio="none"
          width="${width}"
          height="${height}"
          xlink:href="${layer.frame.imgUrl}"
          x="0"
          y="0"
        />
      </svg>
      `;
      return `<g transform="rotate(${a} ${rr.x + width / 2} ${rr.y +
        height / 2})">${svgString}</g>`;
    }

    if (layer.target === 'text') {
      const domNodeCore = document.getElementById(`textSvg_${layer.id}`);
      if (domNodeCore) {
        const domNode = domNodeCore.cloneNode(true);

        const {
          controls: { width, height, transform: transformControls }
        } = styler({
          x: layer.position.x,
          y: layer.position.y,
          scaleX: layer.scaleX,
          scaleY: layer.scaleY,
          width: layer.width,
          height: layer.height,
          angle: layer.angle
        });

        const rr = getNewMatrix(transformControls);

        domNode.setAttribute('preserveAspectRatio', 'none');
        domNode.setAttribute('width', width);
        domNode.setAttribute('height', height);
        domNode.setAttribute('x', rr.x);
        domNode.setAttribute('y', rr.y + 6);
        domNode.setAttribute('id', layer.id);
        return `<g transform="rotate(${a} ${rr.x + width / 2} ${rr.y +
          height / 2})">${domNode.outerHTML}</g>`;
      }
      return null;
    }
    return null;
  });

  const arraySvgToString = arrSVG => {
    let result = '';
    htmlSVGArray.forEach(layerSVG => {
      result = layerSVG + result;
    });
    return result;
  };
  // style="background: white"
  const svgData = `<?xml version="1.0" standalone="no"?>
  <svg version="1.1"
      baseProfile="full"
     width="${canvasWidth}px"
      height="${canvasHeight}px"
     
      xmlns="http://www.w3.org/2000/svg"
      >
      <g xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${arraySvgToString(htmlSVGArray)}
      </g>
  </svg>`;

  return svgData;
};
