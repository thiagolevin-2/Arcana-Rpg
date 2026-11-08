export const PORTRAIT_TYPES=['image/jpeg','image/png','image/webp'];
export function validatePortraitFile(file){
 if(!file||!PORTRAIT_TYPES.includes(file.type))throw Error('Escolha uma imagem PNG, JPG ou WebP.');
 if(!Number.isFinite(file.size)||file.size<=0||file.size>12*1024*1024)throw Error('Escolha uma imagem de até 12 MB.');
}
export function portraitDimensions(width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>40000000)throw Error('A imagem é grande demais. Use uma versão de até 40 megapixels.');
 const ratio=Math.min(1,900/Math.max(width,height));return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};
}
