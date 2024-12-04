import sharp from 'sharp'

// const Format = {
//   webp: 'webp',
//   avif: 'avif'
// }

// TODO:如果图片格式本来是webp或者avif直接跳过
// lg width 1080
// md width 768
// sm width 540
// xs width 360
// thumb width 180
export async function convertToWebp (readable) {
  const { data } = await readable.pipe(sharp())
    // .toFormat(Format.webp)
    .webp({ quality: 75})
    .toBuffer({ resolveWithObject: true })
  
    
  return data
}