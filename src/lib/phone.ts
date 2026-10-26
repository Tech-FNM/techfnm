// "0313-9023118" → "+923139023118": tel: links need the international format to dial from abroad.
export const telHref = (phone: string) => {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return digits.startsWith('0') ? `+92${digits.slice(1)}` : digits;
};
