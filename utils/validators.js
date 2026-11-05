const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;

exports.validateName = (name) => {
  const value = (name || '').trim();
  if (!value) return 'Name is required';
  if (value.length < 2) return 'Name must be at least 2 characters';
  if (value.length > 50) return 'Name must be at most 50 characters';
  if (!NAME_REGEX.test(value)) return 'Name can contain only letters and spaces';
  return '';
};

exports.validateEmail = (email) => {
  const value = (email || '').trim();
  if (!value) return 'Email is required';
  if (value.length > 100) return 'Email is too long';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email (e.g. name@example.com)';
  return '';
};

exports.validatePassword = (password) => {
  const value = password || '';
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 64) return 'Password must be at most 64 characters';
  if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
  if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
  if (!/[0-9]/.test(value)) return 'Password must include a number';
  return '';
};