export default function isUrl(url: any): boolean {
  try {
    new URL(url || "");
    return true;
  } catch (e) {
    return false;
  }
}
