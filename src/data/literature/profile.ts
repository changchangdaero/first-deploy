// Literature 프로필: "/literature" About 섹션의 사진, 소개, 이력, 링크를 관리합니다.
import { links, type ProfileLink } from '@/data/links';

export const literatureProfile = {
  name: '유창민',
  // 사진 경로. 비워두면 사진 영역이 숨겨집니다.
  image: '/me.jpg',
  headline: '글을 쓰고 있습니다. 시와 에세이를 좋아해요!',
  summary: '',
  highlights: [
    '교보문고 시·에세이 분야 주간베스트 도서 [사랑과 타박상] 저자',
    '한국예술인복지재단 신진예술인',
    '브런치스토리 작가',
    '주머니시 작가',
  ],
  links: [
    { label: 'Profile', icon: 'profile', href: links.profile },
    { label: 'Brunch', icon: 'brunch', href: links.brunch },
    { label: 'Blog', icon: 'blog', href: links.blog },
    { label: 'Instagram', icon: 'instagram', href: links.instagram },
  ] satisfies ProfileLink[],
};
