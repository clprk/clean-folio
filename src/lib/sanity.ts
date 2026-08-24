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
    currentCompany,
    currentUrl,
    previousRole,
    previousCompany,
    previousUrl,
    description
}`;

export const aboutQuery = `
    *[_type == "about"][0]{
    header,
    leftText,
    centerText,
    rightText,
    profileImage {
        ...,
        hotspot,
        crop
    },
    summary,
    favorites,
    experience[] {
        order,
        company,
        role,
        dates,
        description
    },
}`;

export const selectedQuery = `
    *[_type == "work" && selected == true && defined(slug.current)]|order(order asc)[0...12]{
    _id, 
    title, 
    url,
    slug,
    image {
        ...,
        hotspot,
        crop
    },
    video,
    alt,
    tags,
}`;

export const moreQuery = `
    *[_type == "work" && selected != true && (defined(slug.current) || defined(link))]|order(order asc)[0...12]{
    _id, 
    title, 
    slug,
    link,
    image {
        ...,
        hotspot,
        crop
    },
    video,
    alt,
    tags,
}`;

export const slugQuery = `
{"work": *[_type == "work" && slug.current == $slug][0]{
    ...,
    body[] {
        _type,
        _type == "imageBlock" => {
            heading,
            mediaType,
            image,
            caption,
            dark,
            video{
                asset->{
                    playbackId,
                    status
                }
            },
            alt,
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
                video,
                alt,
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
