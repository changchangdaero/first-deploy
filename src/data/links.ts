// 외부 링크 모음: 사이트 전체의 외부 URL을 한곳에서 관리합니다. 빈 문자열이면 해당 버튼은 숨겨집니다.
export const links = {
  github: 'https://github.com/changchangdaero',
  email: 'changchangdaero@naver.com',
  velog: '',
  brunch: 'https://brunch.co.kr/@changchangdaero',
  blog: 'https://blog.naver.com/changchangdaero',
  profile:
    'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=35402807&qvt=0&query=%EC%9C%A0%EC%B0%BD%EB%AF%BC',
  instagram: 'https://www.instagram.com/chang_y.u/',
};

export type LinkIcon = 'github' | 'mail' | 'velog' | 'brunch' | 'instagram' | 'profile' | 'blog';

export type ProfileLink = {
  label: string;
  href: string;
  icon?: LinkIcon;
};
