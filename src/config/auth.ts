export const getAuthorizedAdminEmails = (): string[] => {
  const emails = import.meta.env.VITE_ADMIN_EMAILS || "";
  return emails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const isAuthorizedAdmin = (email: string): boolean => {
  const authorizedEmails = getAuthorizedAdminEmails();
  return authorizedEmails.includes(email.toLowerCase());
};
