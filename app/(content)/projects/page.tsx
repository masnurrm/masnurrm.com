import { IconArrow, IconCode } from '@/components/ui/icons';
import projects from '@/data/projects';
import { getImage } from '@/lib/hooks/use-placeholder';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Some collection of my past works.',
};

export default async function Projects() {
  const filteredProject = projects.sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)),
  );
  return (
    <section className="px-4 md:px-12 lg:container lg:px-24 xl:px-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold md:text-6xl">Projects</h1>
        <p className="text-muted-foreground">Stay tune, let me sleep first.</p>
      </div>
      <div className="mt-8">
        {filteredProject.length ? (
          <div className="space-y-6">
            {filteredProject.map(async (project, i) => {
              const base64 = await getImage(
                typeof project.image === 'string'
                  ? project.image
                  : project.image.src,
              );
              return (
                <div
                  className="flex w-full flex-col rounded-lg border-2 bg-muted lg:flex-row"
                  key={i}
                >
                  <Image
                    className="rounded-lg"
                    width="489"
                    height="256"
                    src={project.image}
                    alt={project.title}
                    placeholder="blur"
                    blurDataURL={base64}
                  />
                  <div className="flex max-w-md flex-col justify-between p-4 md:p-6">
                    <div className="space-y-3">
                      <div>
                        <h1 className={project.font ?? undefined}>
                          {project.title}
                        </h1>
                        <p className="pt-2 text-xs text-muted-foreground md:text-sm">
                          Created at{' '}
                          {dayjs(project.createdAt).format('MMMM YYYY')}
                        </p>
                      </div>
                      <p className="text-sm md:text-base">
                        {project.description}
                      </p>
                      <div className="flex space-x-2">
                        {project.technology.map((tech, idx) => (
                          <Link
                            className={cn(
                              tech.color || 'bg-neutral-400',
                              'rounded-sm px-1 py-0.5 text-[10px] font-bold uppercase text-neutral-100 hover:opacity-80 md:text-xs',
                            )}
                            key={idx}
                            target="_blank"
                            href={tech.url}
                          >
                            {tech.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4 font-bold md:text-lg">
                      {project.url && (
                        <Link
                          target="_blank"
                          className="inline-flex items-center hover:underline"
                          href={project.url}
                        >
                          <IconArrow className="md:size-5" />
                          <p className="pl-2">Visit Project</p>
                        </Link>
                      )}
                      {project.source && (
                        <Link
                          target="_blank"
                          className="inline-flex items-center hover:underline"
                          href={project.source}
                        >
                          <IconCode className="md:size-5" />
                          <p className="pl-2">Source Code</p>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4">
            <p>No project.</p>
          </div>
        )}
      </div>
    </section>
  );
}
