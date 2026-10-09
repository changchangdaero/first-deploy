// 기술 스택: "/engineering" Tech Stack 섹션에 표시할 그룹별 기술과 아이콘을 관리합니다.
// icon은 public 폴더의 이미지 경로(문자열) 또는 react-icons 아이콘입니다.
import type { IconType } from 'react-icons';
import { SiGit, SiGrafana, SiJenkins, SiPrometheus, SiTerraform } from 'react-icons/si';

export type Skill = {
  name: string;
  icon: string | IconType;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export const techStackGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', icon: '/tech-icons/python.svg' },
      { name: 'SQL', icon: '/tech-icons/sql.svg' },
      { name: 'JavaScript', icon: '/tech-icons/javascript.svg' },
    ],
  },
  {
    title: 'Infra / DevOps',
    skills: [
      { name: 'Linux', icon: '/tech-icons/linux.svg' },
      { name: 'AWS', icon: '/tech-icons/aws.svg' },
      { name: 'Docker', icon: '/tech-icons/docker.svg' },
      { name: 'Terraform', icon: SiTerraform },
      { name: 'Git', icon: SiGit },
      { name: 'Jenkins', icon: SiJenkins },
      { name: 'Prometheus', icon: SiPrometheus },
      { name: 'Grafana', icon: SiGrafana },
    ],
  },
];
