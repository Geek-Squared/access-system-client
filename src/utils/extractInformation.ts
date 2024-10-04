export const extractInformation = (
  text: string,
  setIdNumber: any,
  setFullName: any
) => {
  // Regex to extract ID number in different formats
  const idRegex = /\d{2}-\d{6,7}\s\w\s\d{2}/;

  // Different regex patterns to extract concatenated names and names after "CIT"
  const concatenatedNameRegex =
    /SURNAME\s*FIRST NAME\s*DATE OF BIRTH\s*([A-Z\s]+)\d{2}\/\d{2}\/\d{4}/i;
  const nameAfterCITRegex = /CIT\s?[MF]\s*([A-Z\s]+?)\s+\d{2}\/\d{2}\/\d{4}/i;

  // Regex to capture both surname and first name when separated
  const separatedNameRegex = /SURNAME\s+([A-Z]+)\s+FIRST NAME\s+([A-Z\s]+)/i;

  // Extract ID using regex
  const idMatch = text.match(idRegex);
  if (idMatch) {
    setIdNumber(idMatch[0]); // Set extracted ID number
  }

  // Case 1: Extract names when they are concatenated after SURNAME, FIRST NAME, DATE OF BIRTH
  const concatenatedNameMatch = text.match(concatenatedNameRegex);
  if (concatenatedNameMatch) {
    const names = concatenatedNameMatch[1].trim();

    // Split the names to distinguish between surname and first names
    const nameParts = names.split(/\s+/);
    if (nameParts.length >= 2) {
      const surname = nameParts[0]; // First part is surname
      const firstName = nameParts.slice(1).join(" "); // Rest are first names
      setFullName(`${surname} ${firstName}`); // Set extracted full name
      return; // Exit after successful extraction
    }
  }

  // Case 2: Extract names when they appear after "CIT M" or "CIT F"
  const nameAfterCITMatch = text.match(nameAfterCITRegex);
  if (nameAfterCITMatch) {
    const fullNameExtracted = nameAfterCITMatch[1].trim();
    setFullName(fullNameExtracted); // Set extracted full name
    return; // Exit after successful extraction
  }

  // Case 3: Extract names when they are separated by SURNAME and FIRST NAME keywords
  const separatedNameMatch = text.match(separatedNameRegex);
  if (separatedNameMatch) {
    const surname = separatedNameMatch[1].trim();
    const firstName = separatedNameMatch[2].trim();
    setFullName(`${firstName} ${surname}`); // Set extracted full name
    return; // Exit after successful extraction
  }

  // Default case: If no patterns matched, log a message or handle accordingly
  console.warn("Unable to extract full name from text:", text);
};
