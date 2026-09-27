/**
 * Site-wide behaviour, bundled once and loaded on every page.
 * Each feature is small and independent; everything degrades to plain HTML.
 */
import { initAnnouncement } from './announcement';
import { initHeader } from './header';
import { initLangSwitch } from './lang';
import { initMagnetic } from './magnetic';
import { initMobileMenu } from './mobile-menu';
import { initOpenStatus } from './open-status';
import { initDemoPreview } from './preview';
import { initReveal } from './reveal';
import { initSmoothScroll } from './smooth-scroll';

const root = document.documentElement;

initDemoPreview(root);
initReveal();
initHeader();
initMobileMenu();
initOpenStatus();
initAnnouncement();
initLangSwitch();
initMagnetic();
initSmoothScroll(root);
