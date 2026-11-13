import { useEffect, useImperativeHandle, useRef } from 'react';
import CuriexLogo from './CuriexLogo.jsx';
import { closeTopLayer } from '../utils/topLayerAnimation.js';

const SECTION_LINKS = [
  { href: '#about', label: 'Overview' },
  { href: '#pillars', label: 'Program Pillars' },
  { href: '#schedule', label: 'Itinerary' },
  { href: '#buildathon', label: 'Buildathon' },
  { href: '#tracks', label: 'Problem Arenas' },
  { href: '#faq', label: 'FAQ' },
];

const EXTERNAL_LINKS = [
  { href: 'https://www.ieeespskc.in/', label: 'IEEE SPS Kerala Chapter' },
  {
    href: 'https://signalprocessingsociety.org/community-involvement/women-signal-processing',
    label: 'WISP Global Initiative',
  },
  { href: 'https://www.ieee.org/', label: 'IEEE.org' },
  { href: 'https://ieeekerala.org/', label: 'IEEE Kerala Section' },
];

const SPS_LOGO_ONLINE = 'https://www.ieeespskc.in/img/logo/sps%20kc%20png.png';

/**
 * Native top-layer modal drawer for mobile navigation.
 */
export default function MobileNavDrawer({ ref, onOpenRegister, onOpenChange }) {
  const drawerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      const dialog = drawerRef.current;
      if (!dialog || dialog.open) return;
      dialog.removeAttribute('data-closing');
      dialog.showModal();
      onOpenChange?.(true);
    },
    close: () => closeTopLayer(drawerRef.current),
  }));

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      dialog.removeAttribute('data-closing');
      onOpenChange?.(false);
    };

    const handleCancel = (event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeTopLayer(dialog);
      }
    };

    const handleClick = (event) => {
      if (event.target === dialog) {
        closeTopLayer(dialog);
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onOpenChange]);

  const handleLinkClick = () => {
    closeTopLayer(drawerRef.current);
  };

  const handleRegisterClick = async () => {
    await closeTopLayer(drawerRef.current);
    onOpenRegister?.();
  };

  return (
    <dialog
      ref={drawerRef}
      id="mobile-nav-drawer"
      className="mobile-drawer"
      aria-label="Navigation menu"
    >
      <div className="mobile-drawer__panel">
        <div className="mobile-drawer__header">
          <a href="#hero" className="brand-link" aria-label="CURIEX Home" onClick={handleLinkClick}>
            <CuriexLogo variant="nav" />
          </a>
          <button
            type="button"
            className="dialog-close"
            aria-label="Close navigation menu"
            autoFocus
            onClick={() => closeTopLayer(drawerRef.current)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="mobile-drawer__nav" aria-label="Mobile navigation">
          <ul className="mobile-drawer__list">
            {SECTION_LINKS.map((item, idx) => (
              <li key={item.href} style={{ '--item-idx': idx }}>
                <a href={item.href} onClick={handleLinkClick}>
                  <span className="mobile-drawer__idx">{String(idx + 1).padStart(2, '0')}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-drawer__external">
            <p className="mobile-drawer__sublabel">Official Portals</p>
            <ul className="mobile-drawer__ext-list">
              {EXTERNAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <span>{item.label}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mobile-drawer__footer">
          <button type="button" className="btn btn--primary mobile-drawer__cta" onClick={handleRegisterClick}>
            Register for Curie X
          </button>
          <div className="mobile-drawer__logos">
            <a href="https://www.ieeespskc.in/" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala Chapter">
              <img
                src={SPS_LOGO_ONLINE}
                alt="IEEE Signal Processing Society Kerala Chapter"
                width="100"
                height="68"
                onError={(e) => {
                  e.currentTarget.src = '/assets/logos/ieee-sps-kerala.png';
                }}
              />
            </a>
            <a
              href="https://signalprocessingsociety.org/community-involvement/women-signal-processing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
            >
              <img
                src="/assets/logos/wisp-kerala.png"
                alt="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
                width="96"
                height="45"
              />
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
