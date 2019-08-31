import { request } from './utils';
export const CLOUDCONVERT_API_KEY =
  'u8RqMJ3wvHdo3nTLPMp31KRk12IkW77zXHSiv9a3tsjGMjk8kuBTm1bl3F4RW1ee';

export const MIRRORED_FONTS_IDS = [6, 16];
// const addFrame = async frame => {
//   let response;

//   try {
//     response = await request({
//       method: 'POST',
//       url: `/frame/new`,
//       data: frame
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const addFrames = () => {
//   for (let index = 1; index < 201; index++) {
//     const id = index + 1;
//     addFrame({
//       name: id,
//       hasViewBox: !!VIEWBOX_FRAMES_ID.includes(id)
//     });
//   }
// };

export const CANVAS_FORMAT_PNG = 'png';
export const CANVAS_FORMAT_SVG = 'svg';
export const CANVAS_FORMAT_DXF = 'dxf';
export const CANVAS_FORMAT_EPS = 'eps';
