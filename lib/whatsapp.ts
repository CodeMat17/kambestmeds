export const WHATSAPP_NUMBER = "2348074442605";

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
