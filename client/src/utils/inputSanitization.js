export const sanitizeInput = (input, options = {}) => {
    const defaultOptions = {
        allowedTags: [],      // Not needed for now, but useful for future use
        allowedAttrs: [],
        maxLength: 255,
        allowedPatterns: null, // Allows us to set a regex pattern if needed (e.g., for email)
        type: null            // New: Define the input type for more specific sanitization
    };

    options = { ...defaultOptions, ...options };

    if (typeof input !== 'string') return '';

    // Trim the input
    input = input.trim();

    // If input exceeds maxLength, truncate it
    if (input.length > options.maxLength) {
        input = input.substring(0, options.maxLength);
    }

    // Remove any potential scripts or dangerous characters
    input = input.replace(/<script.*?>.*?<\/script>/gi, ''); // Strip out scripts
    input = input.replace(/<[^>]+>/g, '');                   // Strip out all HTML tags

    // Depending on input type, apply additional sanitization
    switch (options.type) {
        case 'email':
            // Basic email pattern check (or use your own complex regex)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input)) {
                return ''; // Invalid email format
            }
            break;

        case 'username':
            // Allow only alphanumeric characters and underscores for usernames
            input = input.replace(/[^a-zA-Z0-9_]/g, '');
            break;

        case 'password':
            // Ensure password length is within a reasonable range (e.g., 6-128 characters)
            if (input.length < 6 || input.length > options.maxLength) {
                return ''; // Invalid password length
            }
            break;

        default:
            // General sanitization for other inputs
            input = input.replace(/['";&<>]/g, ''); // Strip out common dangerous characters
            break;
    }

    // Optionally apply allowed patterns for special cases
    if (options.allowedPatterns) {
        const regex = new RegExp(options.allowedPatterns);
        if (!regex.test(input)) {
            return ''; // Invalid input format
        }
    }

    // Replace any remaining dangerous characters
    input = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    return input;
};
