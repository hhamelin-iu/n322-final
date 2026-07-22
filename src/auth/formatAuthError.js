export function formatAuthError(error) {
  if (!error) return "";
  const msg = typeof error === "string" ? error : error.message || "";

  if (msg.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (
    msg.includes("auth/user-not-found") ||
    msg.includes("auth/wrong-password") ||
    msg.includes("auth/invalid-credential")
  ) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (msg.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists.";
  }
  if (msg.includes("auth/weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (msg.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }
  if (msg.includes("auth/too-many-requests")) {
    return "Access to this account has been temporarily disabled due to many failed attempts. Try again later.";
  }

  // Strip raw Firebase boilerplate wrapper if unmapped
  return msg.replace(/^Firebase:\s*Error\s*\(([^)]+)\)\.?/i, "$1").trim();
}
