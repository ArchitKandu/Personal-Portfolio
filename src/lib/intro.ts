import { MEDIA, REDUCED_MOTION } from "@/lib/breakpoints";

/** How long the opening veil holds before the page is released. */
export const INTRO_DURATION_MS = 1000;

/** Extra wait added to the hero load sequence while the veil is up. */
export const INTRO_STAGGER_OFFSET = 1.05;

/**
 * Runs before first paint, so the veil is either there from the very first
 * frame or never rendered at all. The intro is skipped for reduced motion,
 * below the desktop breakpoint, on deep links, and on any later visit in the
 * same session.
 */
export const INTRO_SCRIPT = `(function(){try{
var d=document.documentElement;
if(window.matchMedia('${REDUCED_MOTION}').matches)return;
if(!window.matchMedia('${MEDIA.lg}').matches)return;
if(window.location.hash.length>1)return;
if(window.sessionStorage.getItem('ak-intro')==='1')return;
window.sessionStorage.setItem('ak-intro','1');
d.setAttribute('data-intro','1');
var o=d.style.overflow;
d.style.overflow='hidden';
window.setTimeout(function(){d.removeAttribute('data-intro');d.style.overflow=o;},${INTRO_DURATION_MS});
}catch(e){}})();`;
