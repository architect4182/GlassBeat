export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve("#333333");
        return;
      }
      
      canvas.width = 64;
      canvas.height = 64;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      for (let i = 0; i < data.length; i += 16) {
        // Filter out extreme white/black for better vibrancy
        if (data[i] > 230 && data[i+1] > 230 && data[i+2] > 230) continue;
        if (data[i] < 20 && data[i+1] < 20 && data[i+2] < 20) continue;
        
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      
      if (count === 0) {
        resolve("#333333");
        return;
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      resolve(hex);
    };
    
    img.onerror = () => {
      resolve("#333333");
    };
    
    img.src = imageUrl;
  });
}
