const emailValidator = (email) => {
    // Convert to lowercase for consistent validation
    email = email.toLowerCase();

    // Enhanced email format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Basic validation checks
    if (!email || email.length > 254 || !emailRegex.test(email)) {
        return false;
    }

    // Additional security checks
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
        return false;
    }

    return true;
};

module.exports = { emailValidator };