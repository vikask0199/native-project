import { SearchRequestBody, UmbraLink } from "../interfaces/archive";

/**
 * Replace the "next" link object in links array of archive search results with, one with the correct request body
 * @param links the array of links received from Umbra
 * @param originalBody Original request body from the client
 * @returns {UmbraLink[]} array of links with modified "next" link (if it exists)
 */
export function replaceBodyInNextPageLink(links: UmbraLink[], originalBody: SearchRequestBody): UmbraLink[] {
  // find if the 'next' link exists
  const nextLinkIndex = links.findIndex((link) => link.rel === "next" && link.body);

  // If not found, return the object as it is
  if (nextLinkIndex === -1) return links;
  else {
    links[nextLinkIndex].body = { ...originalBody, token: links[nextLinkIndex].body?.token };
    return links;
  }
}

/**
 * Pick only the required links from the links array. Strip everything else from the array
 * @param links the existing array of links
 * @param {string[]} linksToPick the 'rel' values that need to be picked
 * @returns {UmbraLink[]}
 */
export function pickLinks(links: UmbraLink[], linksToPick: string[]): UmbraLink[] {
  return links.filter((link) => linksToPick.includes(link.rel));
}

/**
 * Convert all hrefs in the links array pointing to umbra's servers, to our URLs pointing to our server
 * @param {UmbraLink[]} links The original links array
 * @param req The express request body from which we extract the protocol, host and path
 * @returns {UmbraLink[]} Modified array of links
 */
export function convertUmbraHrefsToOurHrefs(links: UmbraLink[], path: string): UmbraLink[] {
  return links.map((link) => {
    link.href = path;
    return link;
  });
}
