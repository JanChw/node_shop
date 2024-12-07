import sharp from 'sharp'

const special = {
  lg: 1080,
  md: 768,
  sm: 540,
  xs: 360,
  thumb: 180,
}

export const sizes = Object.keys(special)


// TODO:如果图片格式本来是webp或者avif直接跳过

export async function convertToWebp (readable) {
  const { data } = await readable.pipe(sharp())
    // .toFormat(Format.webp)
    .webp({ quality: 80})
    .toBuffer({ resolveWithObject: true })
  
    
  return data
}

export function resize(arrayBuffer) {
  return sizes.map(async (val) =>
  {
    const buffer = await sharp(arrayBuffer).resize(special[val]).toBuffer()  
    return {special:val,data:buffer}
  }
  )
}