import Canvas from '@/components/canvas';
import MePhoto from '@/public/default/me-photo.svg';
import { Doodle1, Doodle2 } from '@/components/doodle';
import Image from 'next/image';
import Link from 'next/link';

export default function Main() {
export default function Main() {
  return (
    <section className="relative flex h-full cursor-pencil items-center justify-center pb-6 dark:cursor-pencil-dark md:w-screen md:pb-0 md:pr-2.5">
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
        <div className="relative hidden w-[350px] place-items-center dark:grid md:w-[400px]">
          <Image alt="photo" src={MePhoto} priority width={300} height={300} />
          <Doodle1 className="absolute bottom-0 stroke-[#ffd55a]/70" />
        </div>
        <div className="relative grid w-[350px] place-items-center dark:hidden md:w-[400px]">
          <Image alt="photo" src={MePhoto} priority width={300} height={300} />
          <Doodle1 className="absolute bottom-0 stroke-[#ffd55a]/70" />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 md:ml-4 md:items-start">
          <h1 className="text-md mt-1 font-doodle text-3xlmd:text-left md:text-4xl px-4">
            It&apos;s me,
            <span className="relative mx-1.5">
              masnurrm
              <Doodle2 className="absolute -bottom-4 -right-4 hidden w-32 stroke-[#ffd55a]/50 dark:block md:w-48 md:stroke-[#ffd55a]/70" />
              <Doodle2 className="absolute -bottom-4 -right-4 block w-32 stroke-[#a3a3a3]/50 dark:hidden md:w-48 md:stroke-[#a3a3a3]/70" />
            </span>
            &#128569; 🫵
          </h1>
          <p className="text-md max-w-[500px] text-center md:text-left md:text-lg px-4">
            Pretending as a Software Engineer{' '}
            <span role="img" aria-label="amiin">
              🤲
            </span>{' '}
            focusing on Cloud, DevSecOps, and Backend evelopment.{' '}
            <i>Psst, talking about business too (lagi BU)!</i>
          </p>
          <p className="text-md max-w-[500px] text-center md:text-left md:text-lg px-4">
            {'Peek my '}
            <Link
              className="relative z-20 font-semibold underline"
              href="/projects"
            >
              past works
            </Link>
            {', and learn more '}
            <Link
              href="/about"
              className="relative z-20 font-semibold underline"
            >
              about me
            </Link>
            .
          </p>
        </div>
      </div>
      <Canvas />
    </section>
      </div>
      <Canvas />
    </section>
  );
}
