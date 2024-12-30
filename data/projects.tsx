import { StaticImageData } from 'next/image';

type ProjectType = {
  title: string;
  description: string;
  createdAt: string;
  image: string | StaticImageData;
  technology: {
    name: string;
    url: string;
    color?: string;
  }[];
  source?: string;
  url?: string;
  font?: string;
};

const project: ProjectType[] = [
  // {
  //   title: 'MyIstiqlal',
  //   image: '/projects/myistiqlal.webp',
  //   description:
  //     'API project for Istiqlal Mosque built with Nest.js, Xendit, and SendGrid.',
  //   createdAt: '2024-06-03',
  //   technology: [],
  //   url: 'https://api.myistiqlal.com/',
  // },
];

export default project;
