export { cn } from "cn";
export function proxyImage(remoteUrl: string): string {
  return remoteUrl.replace("https://ecommerce.routemisr.com/", "/api/image/");
}
