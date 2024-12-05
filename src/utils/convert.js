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
    .webp({ quality: 75})
    .toBuffer({ resolveWithObject: true })
  
    
  return data
}

export function resize(readable) {
  return sizes.map(async (val) =>
  {
    const buffers = await readable.pipe(sharp()).resize(special[val]).toBuffer()  
    return {special:val,data:buffers}
  }
  )
}