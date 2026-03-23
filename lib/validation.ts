export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^[+0-9()\-\s]{7,20}$/;

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

export function validateContactForm(values: ContactFormValues) {
  const data = {
    name: normalizeWhitespace(values.name),
    email: values.email.trim().toLowerCase(),
    subject: normalizeWhitespace(values.subject),
    message: normalizeWhitespace(values.message),
    website: values.website?.trim() ?? "",
  };

  if (data.website) {
    return { success: false as const, error: "Spam detected." };
  }

  if (!data.name || data.name.length > 100) {
    return { success: false as const, error: "Name must be between 1 and 100 characters." };
  }

  if (!EMAIL_REGEX.test(data.email) || data.email.length > 255) {
    return { success: false as const, error: "Please enter a valid email address." };
  }

  if (data.subject.length > 120) {
    return { success: false as const, error: "Subject must be 120 characters or less." };
  }

  if (data.message.length < 10 || data.message.length > 2000) {
    return { success: false as const, error: "Message must be between 10 and 2000 characters." };
  }

  return { success: true as const, data };
}

export function validateCheckoutForm(values: CheckoutFormValues) {
  const data = {
    name: normalizeWhitespace(values.name),
    email: values.email.trim().toLowerCase(),
    phone: normalizeWhitespace(values.phone),
    address: normalizeWhitespace(values.address),
  };

  if (!data.name || data.name.length > 100) {
    return { success: false as const, error: "Full name must be between 1 and 100 characters." };
  }

  if (!EMAIL_REGEX.test(data.email) || data.email.length > 255) {
    return { success: false as const, error: "Please enter a valid email address." };
  }

  if (data.phone && (!PHONE_REGEX.test(data.phone) || data.phone.length > 20)) {
    return { success: false as const, error: "Please enter a valid phone number." };
  }

  if (!data.address || data.address.length < 10 || data.address.length > 250) {
    return { success: false as const, error: "Address must be between 10 and 250 characters." };
  }

  return { success: true as const, data };
}
