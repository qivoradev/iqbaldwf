import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROFILE, TRACKS, getTrackBySlug } from "@/data/portfolio";
import { TrackDetailView } from "@/components/tracks/TrackDetailView";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const allSlugs: { slug: string }[] = [];
  for (const track of TRACKS) {
    allSlugs.push({ slug: track.slug });
    if (track.aliases) {
      for (const alias of track.aliases) {
        allSlugs.push({ slug: alias });
      }
    }
  }
  return allSlugs;
}

export async function generateMetadata({
  params,
}: TrackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrackBySlug(slug);

  if (!track) {
    return {
      title: "Track Not Found",
    };
  }

  return {
    title: `${track.title.id} Portfolio`,
    description: `${track.title.id} Portfolio of ${PROFILE.name} (${PROFILE.handle}), ${PROFILE.degree.id} ${PROFILE.universityShort} ${PROFILE.graduationYear}. ${track.description.id}`,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = getTrackBySlug(slug);

  if (!track) {
    notFound();
  }

  return <TrackDetailView track={track} />;
}
