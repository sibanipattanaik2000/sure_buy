const MEDIA_HOST = "https://media.phonebhai.com";

export function getOptimizedImageUrl(
  url: string,
  width = 640,
  quality = 78,
) {
  if (!url) {
    return url;
  }

  if (!url.startsWith(MEDIA_HOST)) {
    return url;
  }

  const sourcePath = url.slice(`${MEDIA_HOST}/`.length);

  return `${MEDIA_HOST}/cdn-cgi/image/width=${width},quality=${quality},format=auto/${sourcePath}`;
}