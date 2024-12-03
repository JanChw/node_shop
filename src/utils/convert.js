import sharp from 'sharp'

// const Format = {
//   webp: 'webp',
//   avif: 'avif'
// }

// TODO:如果图片格式本来是webp或者avif直接跳过
export async function convertToWebp (readable) {
  const { data } = await readable.pipe(sharp())
    // .toFormat(Format.webp)
    .webp({ quality: 70})
    .toBuffer({ resolveWithObject: true })
  return data
}