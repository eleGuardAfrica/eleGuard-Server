export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function validateEmail (email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    return false;
  }
  return true;
}

export function generateOTPExpiryDate (hours: number) {
  return new Date(Date.now() + hours * 60 * 60* 1000);
};

module.exports = {
  generateOTP,
  validateEmail,
  generateOTPExpiryDate
}