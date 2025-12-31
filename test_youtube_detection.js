// Test YouTube URL detection
const getEmbeddableUrl = (url) => {
    console.log('Original URL:', url);
    
    try {
      // YouTube - watch format
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        console.log('YouTube watch - videoId:', videoId);
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('Converted to:', embedUrl);
          return { url: embedUrl, canEmbed: true };
        }
      }
      
      // YouTube - short format
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0];
        console.log('YouTube short - videoId:', videoId);
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('Converted to:', embedUrl);
          return { url: embedUrl, canEmbed: true };
        }
      }
      
      console.log('URL not detected as embeddable');
      return { url, canEmbed: false };
    } catch (e) {
      console.error('Error parsing URL:', e);
      return { url, canEmbed: false };
    }
};

// Test cases
console.log('\n=== TEST 1: YouTube Watch URL ===');
getEmbeddableUrl('https://www.youtube.com/watch?v=rfscVS0vtbw');

console.log('\n=== TEST 2: YouTube Short URL ===');
getEmbeddableUrl('https://youtu.be/rfscVS0vtbw');

console.log('\n=== TEST 3: Regular Website ===');
getEmbeddableUrl('https://www.smashingmagazine.com/articles/mobile-ux-design-principles/');

console.log('\n=== TEST 4: W3Schools ===');
getEmbeddableUrl('https://www.w3schools.com/html/');
