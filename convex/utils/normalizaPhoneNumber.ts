// Helper function to normalize phone numbers by removing all non-digit characters
function normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  export default normalizePhoneNumber;