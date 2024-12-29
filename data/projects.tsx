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

const project: ProjectType[] = [];

export default project;
