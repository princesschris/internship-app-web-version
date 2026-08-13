export function getPasswordStrength(password) {
  if (!password) return { score: 0, level: 'empty', label: '' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  score = Math.max(1, Math.min(score, 4));

  const levels = ['weak', 'fair', 'good', 'strong'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const index = score - 1;

  return { score, level: levels[index], label: labels[index] };
}