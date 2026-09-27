/**
 * Contact enquiry form: validates, then writes the message into WhatsApp or
 * the visitor's email app. Nothing is sent to or stored on this website.
 * Without JavaScript the form still opens WhatsApp with the message text.
 */
import { openExternal } from '~/lib/browser';
import { fmt, formatIndianMobile, normalizeIndianMobile } from '~/lib/format';
import { enquiryMessage, waLink } from '~/lib/whatsapp';

type FieldName = 'name' | 'phone' | 'message';

export function initEnquiryForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry-form]').forEach(setUp);
}

function setUp(form: HTMLFormElement): void {
  const data = form.dataset;
  const types = JSON.parse(data.types ?? '{}') as Record<string, string>;
  const controls: Record<FieldName, HTMLInputElement | HTMLTextAreaElement> = {
    name: form.querySelector('[name="name"]')!,
    phone: form.querySelector('[name="phone"]')!,
    message: form.querySelector('[name="text"]')!,
  };

  const problems = (): FieldName[] => {
    const found: FieldName[] = [];
    if (!controls.name.value.trim()) found.push('name');
    if (!normalizeIndianMobile(controls.phone.value)) found.push('phone');
    if (controls.message.value.trim().length < 3) found.push('message');
    return found;
  };

  const show = (field: FieldName, invalid: boolean) => {
    const error = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (error) error.hidden = !invalid;
    if (invalid) controls[field].setAttribute('aria-invalid', 'true');
    else controls[field].removeAttribute('aria-invalid');
  };

  // Clear a message as soon as its field is fixed.
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLElement;
    const field = (Object.keys(controls) as FieldName[]).find((k) => controls[k] === target);
    if (field && target.getAttribute('aria-invalid') === 'true') {
      show(field, problems().includes(field));
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = problems();
    (Object.keys(controls) as FieldName[]).forEach((k) => show(k, invalid.includes(k)));
    const first = invalid[0];
    if (first) {
      controls[first].focus();
      return;
    }

    const via =
      (event.submitter as HTMLButtonElement | null)?.value === 'email' ? 'email' : 'whatsapp';
    const checked = form.querySelector<HTMLInputElement>('[name="type"]:checked');
    const type = types[checked?.value ?? 'general'] ?? 'General';
    const name = controls.name.value.trim();
    const brand = document.documentElement.dataset.brandPreview ?? data.brand ?? '';
    const text = enquiryMessage({
      brand,
      type,
      name,
      phone: formatIndianMobile(normalizeIndianMobile(controls.phone.value)!),
      message: controls.message.value,
    });

    if (via === 'whatsapp') {
      openExternal(waLink(data.whatsapp ?? '', text));
    } else {
      const subject = fmt(data.subject ?? '', { type, name });
      window.location.assign(
        `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
      );
    }
  });
}
