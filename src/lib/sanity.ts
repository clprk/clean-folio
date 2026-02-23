import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const { projectId, dataset } = sanityClient.config();
const builder = imageUrlBuilder({ projectId: projectId!, dataset: dataset! });

export const urlFor = (source: SanityImageSource) => builder.image(source);

export const resumeQuery = `
    *[_type == "resume"][0]{
    title,
    resumeUrl,
    "pdfUrl": resume.asset->url
}`;

export const homeQuery = `
    *[_type == "home"][0]{
    header,
    currentRole,
    previousRole,
    description
}`;

export const indexQuery = `*[
  _type == "work"
  && defined(slug.current)
]|order(order asc)[0...12]{
  _id, 
  title, 
  slug, 
  description,
  image {
    ...,
    hotspot,
    crop
  },
  tags,
}`;

export const slugQuery = `{"work": *[_type == "work" && slug.current == $slug][0]{
    ...,
    body[] {
    _type,
    _type == "imageBlock" => {
        heading,
        image,
        caption,
        dark
    },
    _type == "textBlock" => {
        heading,
        content,
        dark,
        header
    },
    _type == "gridBlock" => {
        heading,
        columns,
        items[] {
        type,
        content,
        image,
        subtitle,
        caption
        },
        dark
    }
    }
    }, 
    "allWorks": *[_type == "work" && defined(slug.current)]
        | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        headline,
        order
    }
}`;
