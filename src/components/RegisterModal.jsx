import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { closeTopLayer } from '../utils/topLayerAnimation.js';

const TRACK_OPTIONS = [
  { value: 'biomed', code: 'Track 01', title: 'Assistive & Biomedical Signals' },
  { value: 'acoustic', code: 'Track 02', title: 'Acoustic & Speech Intelligence' },
  { value: 'iot', code: 'Track 03', title: 'Smart Sensing & Edge IoT' },
  { value: 'vision', code: 'Track 04', title: 'Open Innovation in DSP & Vision' },
];

const MODE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'team', label: 'Team (3–4)' },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  institution: '',
  ieeeId: '',
  mode: 'individual',
  track: 'biomed',
  teamName: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{7,18}$/;
const IEEE_ID_RE = /^\d{6,10}$/;

function validateField(field, value, mode) {
  const trimmed = (value || '').trim();
  switch (field) {
    case 'name':
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
      return '';
    case 'email':
      if (!trimmed) return 'Please enter your email address.';
      if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address (e.g., ananya@college.edu).';
      return '';
    case 'phone':
      if (!trimmed) return 'Please enter a contact phone number.';
      if (!PHONE_RE.test(trimmed)) return 'Enter a valid phone number with country/area digits.';
      return '';
    case 'institution':
      if (!trimmed) return 'Please enter your college, university, or organization.';
      return '';
    case 'ieeeId':
      if (trimmed && !IEEE_ID_RE.test(trimmed)) return 'IEEE Member ID should be 6–10 digits.';
      return '';
    case 'teamName':
      if (mode === 'team' && !trimmed) return 'Please enter your team name (or switch to Individual Entry).';
      if (mode === 'team' && trimmed.length < 2) return 'Team name must be at least 2 characters.';
      return '';
    default:
      return '';
  }
}

/**
 * Native <dialog closedby="any"> modal for Curie X registration with uniform cross-medium layout,
 * radio-card selection groups, blur/submit validation, and animated Delegate Pass confirmation.
 */
export default function RegisterModal({ ref }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [dirtyFields, setDirtyFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      dialog.removeAttribute('data-closing');
      setSubmittedData(null);
      setErrors({});
      setDirtyFields({});
      setIsSubmitting(false);
      dialog.showModal();
    },
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      dialog.removeAttribute('data-closing');
      setIsSubmitting(false);
    };

    const handleCancel = (event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeTopLayer(dialog, 'cancel');
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);

    let handleBackdropClick = null;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      handleBackdropClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        closeTopLayer(dialog);
      };
      dialog.addEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
      if (handleBackdropClick) {
        dialog.removeEventListener('click', handleBackdropClick);
      }
    };
  }, []);

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setForm((prev) => {
      const updated = { ...prev, [field]: nextValue };
      if (field === 'mode' && nextValue !== 'team') {
        setErrors((errPrev) => ({ ...errPrev, teamName: '' }));
      }
      return updated;
    });

    if (nextValue.trim().length > 0) {
      setDirtyFields((prev) => ({ ...prev, [field]: true }));
    }

    if (errors[field]) {
      const nextErr = validateField(field, nextValue, field === 'mode' ? nextValue : form.mode);
      if (!nextErr) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleBlur = (field) => (event) => {
    const val = event.target.value;
    if (!dirtyFields[field] && !val.trim()) return;
    const msg = validateField(field, val, form.mode);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const fieldsToCheck = ['name', 'email', 'phone', 'institution', 'ieeeId'];
    if (form.mode === 'team') fieldsToCheck.push('teamName');

    const nextErrors = {};
    let firstInvalidField = null;
    for (const f of fieldsToCheck) {
      const msg = validateField(f, form[f], form.mode);
      if (msg) {
        nextErrors[f] = msg;
        if (!firstInvalidField) firstInvalidField = f;
      }
    }

    if (firstInvalidField) {
      setErrors(nextErrors);
      const idMap = {
        name: 'reg-name',
        email: 'reg-email',
        phone: 'reg-phone',
        institution: 'reg-institution',
        ieeeId: 'reg-ieee',
        teamName: 'reg-team-name',
      };
      const el = formRef.current?.querySelector(`#${idMap[firstInvalidField]}`);
      el?.focus();
      return;
    }

    setIsSubmitting(true);
    const trackObj = TRACK_OPTIONS.find((t) => t.value === form.track) || TRACK_OPTIONS[0];
    setSubmittedData({
      passCode: `CX-${String(Math.floor(1000 + Math.random() * 9000))}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      institution: form.institution.trim(),
      ieeeId: form.ieeeId.trim() || 'Non-Member / Guest',
      mode: form.mode,
      teamName: form.teamName.trim(),
      trackObj,
    });
    setForm(INITIAL_FORM);
    setErrors({});
    setDirtyFields({});
    setIsSubmitting(false);
  };

  return (
    <dialog
      ref={dialogRef}
      id="register-dialog"
      className="modal-dialog"
      {...{ closedby: 'any' }}
      aria-labelledby="register-dialog-title"
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <div>
            <p className="eyebrow eyebrow--gold dialog-eyebrow">CURIΣX DELEGATE PASS</p>
            <h2 id="register-dialog-title">Register Your Seat</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            autoFocus
            aria-label="Close registration modal"
            onClick={() => closeTopLayer(dialogRef.current, 'cancel')}
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
        </header>

        {!submittedData ? (
          <form
            ref={formRef}
            id="curie-register-form"
            className="register-form"
            method="post"
            aria-labelledby="register-dialog-title"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="dialog-body">
              <div className="form-row">
                <label htmlFor="reg-name">
                  Full Name <span className="req-mark" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  autoComplete="name"
                  enterKeyHint="next"
                  required
                  minLength={2}
                  placeholder="e.g., Ananya Nair"
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'reg-name-err' : undefined}
                  value={form.name}
                  onChange={updateField('name')}
                  onBlur={handleBlur('name')}
                />
                {errors.name && (
                  <span id="reg-name-err" className="field-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <label htmlFor="reg-email">
                    Email Address <span className="req-mark" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    required
                    placeholder="ananya@college.edu"
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'reg-email-err' : undefined}
                    value={form.email}
                    onChange={updateField('email')}
                    onBlur={handleBlur('email')}
                  />
                  {errors.email && (
                    <span id="reg-email-err" className="field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <label htmlFor="reg-phone">
                    Phone (WhatsApp) <span className="req-mark" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    required
                    placeholder="+91 98765 43210"
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'reg-phone-err' : undefined}
                    value={form.phone}
                    onChange={updateField('phone')}
                    onBlur={handleBlur('phone')}
                  />
                  {errors.phone && (
                    <span id="reg-phone-err" className="field-error" role="alert">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <label htmlFor="reg-institution">
                    Institution / College <span className="req-mark" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg-institution"
                    name="institution"
                    autoComplete="organization"
                    enterKeyHint="next"
                    required
                    placeholder="College or Organization"
                    aria-invalid={errors.institution ? 'true' : undefined}
                    aria-describedby={errors.institution ? 'reg-inst-err' : undefined}
                    value={form.institution}
                    onChange={updateField('institution')}
                    onBlur={handleBlur('institution')}
                  />
                  {errors.institution && (
                    <span id="reg-inst-err" className="field-error" role="alert">
                      {errors.institution}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <label htmlFor="reg-ieee">
                    IEEE ID <span className="optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="reg-ieee"
                    name="ieeeId"
                    inputMode="numeric"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="done"
                    placeholder="e.g., 98765432"
                    aria-invalid={errors.ieeeId ? 'true' : undefined}
                    aria-describedby={errors.ieeeId ? 'reg-ieee-err' : undefined}
                    value={form.ieeeId}
                    onChange={updateField('ieeeId')}
                    onBlur={handleBlur('ieeeId')}
                  />
                  {errors.ieeeId && (
                    <span id="reg-ieee-err" className="field-error" role="alert">
                      {errors.ieeeId}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <span className="form-label-text" id="reg-mode-label">Participation</span>
                  <div className="mode-pill-group" role="radiogroup" aria-labelledby="reg-mode-label">
                    {MODE_OPTIONS.map((opt) => (
                      <label key={opt.value} className="mode-pill">
                        <input
                          type="radio"
                          name="mode"
                          value={opt.value}
                          checked={form.mode === opt.value}
                          onChange={updateField('mode')}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="reg-track">Preferred Track</label>
                  <select
                    id="reg-track"
                    name="track"
                    value={form.track}
                    onChange={updateField('track')}
                  >
                    {TRACK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.code} — {opt.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {form.mode === 'team' && (
                <div className="form-row form-row--reveal">
                  <label htmlFor="reg-team-name">
                    Team Name <span className="req-mark" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg-team-name"
                    name="teamName"
                    enterKeyHint="done"
                    required
                    minLength={2}
                    placeholder="e.g., Fourier Queens"
                    aria-invalid={errors.teamName ? 'true' : undefined}
                    aria-describedby={errors.teamName ? 'reg-team-err' : undefined}
                    value={form.teamName}
                    onChange={updateField('teamName')}
                    onBlur={handleBlur('teamName')}
                  />
                  {errors.teamName && (
                    <span id="reg-team-err" className="field-error" role="alert">
                      {errors.teamName}
                    </span>
                  )}
                </div>
              )}

              <button type="submit" className="btn btn--primary dialog-submit" disabled={isSubmitting}>
                Confirm Registration
              </button>
            </div>
          </form>
        ) : (
          <div className="dialog-body register-confirmation panel-enter" role="status" aria-live="polite">
            <div className="pass-card">
              <div className="pass-card__head">
                <div>
                  <p className="eyebrow eyebrow--gold">PASS RESERVED</p>
                  <h3>Welcome to CURIΣX</h3>
                </div>
                <span className="pass-code-badge">{submittedData.passCode}</span>
              </div>

              <p className="pass-card__lead">
                Your provisional delegate pass has been recorded for the <strong>CURIΣX</strong> two-day program &amp; Buildathon.
              </p>

              <dl className="pass-meta-grid">
                <div>
                  <dt>Delegate</dt>
                  <dd>{submittedData.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{submittedData.email}</dd>
                </div>
                <div>
                  <dt>Institution</dt>
                  <dd>{submittedData.institution}</dd>
                </div>
                <div>
                  <dt>Participation</dt>
                  <dd>
                    {submittedData.mode === 'team'
                      ? `Team: ${submittedData.teamName}`
                      : 'Individual (Day 1 Matchmaking)'}
                  </dd>
                </div>
                <div>
                  <dt>Preferred Track</dt>
                  <dd>
                    {submittedData.trackObj.code} — {submittedData.trackObj.title}
                  </dd>
                </div>
                <div>
                  <dt>IEEE ID</dt>
                  <dd>{submittedData.ieeeId}</dd>
                </div>
              </dl>
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => closeTopLayer(dialogRef.current, 'confirm')}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
