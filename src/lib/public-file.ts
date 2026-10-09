// 정적 파일 존재 확인: public 폴더에 실제로 있는 이미지인지 빌드 시점에 확인해, 없는 이미지는 화면에서 숨깁니다.
import { existsSync } from 'node:fs';
import path from 'node:path';

export function publicFileExists(publicPath: string) {
  if (!publicPath) {
    return false;
  }

  return existsSync(path.join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}
