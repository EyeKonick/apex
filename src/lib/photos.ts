import type { ImageMetadata } from 'astro';
import photos from '../data/photos.json';

/**
 * Every image under src/assets/images, keyed by its path relative to that folder
 * (e.g. "placeholders/roof-framing.jpg"). photos.json refers to files by that path,
 * so swapping a photo means replacing the file or editing photos.json, never code.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export interface Photo {
  file: string;
  alt: string;
  placeholder: boolean;
  credit?: { photographer: string; source: string; url: string };
}

export interface ResolvedPhoto extends Photo {
  src: ImageMetadata;
}

export function resolvePhoto(photo: Photo): ResolvedPhoto {
  const mod = files[`../assets/images/${photo.file}`];
  if (!mod) {
    throw new Error(`photos.json points to "${photo.file}", which is not in src/assets/images/.`);
  }
  return { ...photo, src: mod.default };
}

export const heroPhotos = (photos.hero as Photo[]).map(resolvePhoto);
export const aboutPhoto = resolvePhoto(photos.about as Photo);

/** One photo per service, keyed by the service's `id` in services.json. */
export const servicePhotos: Record<string, ResolvedPhoto> = Object.fromEntries(
  Object.entries(photos.services as Record<string, Photo>).map(([id, p]) => [id, resolvePhoto(p)]),
);

/** One photo per project, keyed by the project's `id` in work.json. */
export const workPhotos: Record<string, ResolvedPhoto> = Object.fromEntries(
  Object.entries(photos.work as Record<string, Photo>).map(([id, p]) => [id, resolvePhoto(p)]),
);
