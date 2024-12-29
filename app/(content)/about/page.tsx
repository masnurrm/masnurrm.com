import Blob from '@/components/blob';
import type { Metadata } from 'next';
import Link from 'next/link';

const socials = [
  {
    name: 'Email',
    url: 'mailto:hi@masnurrm.com',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/nurmuhammad22/',
  },
  {
    name: 'Github',
    url: 'https://github.com/masnurrm',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/masnurrm',
  },
];

export const metadata: Metadata = {
  title: 'About',
  description:
    'Hello everyone, my name is Nur Muhammad Ainul Yaqin (masnurrm).',
};

export default function About() {
  return (
    <section className="-mt-6 max-w-screen-md md:mx-12">
      <Blob />
      <div className="prose mt-4 max-w-full space-y-8 dark:prose-invert">
        <div>
          <h1 id="about">
            <Link href="#about">About</Link>
          </h1>
          <p>
            Hi guys, I&apos;m here with a new face! I think for now i just
            copy-paste from my LinkedIn about section for this part, haha.
          </p>{' '}
          <p>
            After a long journey in college, being UED, backend, DevOps, and
            also project manager or team lead in some projects, I&apos;m finally
            into cloud engineer for my current job. I don&apos;t know if it is
            absurd, but even in my role as Cloud Engineer, my workloads included
            DevSecOps and SRE. Hopefully, I can step further and always be
            relevant to digital things in the future.
          </p>{' '}
          <p>
            But will I &apos;gatekeep&apos; myself off only to these things? Of
            course not. I will still be me, I&apos;m still into business. As you
            know, I have previously founded (and co-founded) some startups, but
            it isn&apos;t going well for sure. Just give me time, let me learn,
            and wait for me to wake up—build something again!{' '}
          </p>{' '}
          <p>
            By the way, for those who know me as a person who likes to compete,
            yes, I still do, i mean, i still into it (more precisely, organizing
            myself to be able to join competitions out there again—espescially
            in hackathon, ideathon, or something related). Yes, the point is,
            now I&apos;m still adapting to my full-time job and often need to go
            to the office or client (because it&apos;s an IT consultant, FYI).
          </p>{' '}
          <p>
            Am i forgot to doing intro? Well, you can stalk me on my social
            account. It content-segmented for each social account. If you wanna
            find me as formal or professional person, just catch me up on the
            LinkedIn. How about the rest?
          </p>
        </div>

        <div>
          <h1 id="contact">
            <Link href="#contact">Contact</Link>
          </h1>
          <p>
            I&apos;m always excited to connect with everyone so please
            don&apos;t hesitate to reach out by following my social media below:
          </p>
          <ul>
            {socials.map((data, idx) => (
              <li key={idx}>
                <p className="my-2 truncate">
                  {data.name} -{' '}
                  <Link target="_blank" className="underline" href={data.url}>
                    {data.url.replace('mailto:', '')}
                  </Link>
                </p>
              </li>
            ))}
          </ul>
          <p>
            Also, you can read my CV (general){' '}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              href="https://drive.google.com/file/d/1WUegCPQlh3esqIrfmkF8H8Q3rpll_pv8/view?usp=sharing"
            >
              here
            </Link>
            . Thank you!
          </p>
        </div>
      </div>
    </section>
  );
}
