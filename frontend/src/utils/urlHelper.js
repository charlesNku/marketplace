import { BASE_URL } from '../services/api';

/**
 * Ensures product images have the correct base URL.
 * Handles both absolute URLs and relative paths from the backend.
 * @param {string} path - The image path or URL
 * @param {string} type - 'product' or 'thumbnail' (optional)
 * @returns {string} - The full image URL or a placeholder
 */
export const getImageUrl = (path, type = 'product') => {
    if (!path) {
        return 'https://placehold.co/400x400/f8fafc/94a3b8?text=Product';
    }

    // If it's already an absolute URL or Base64 data, return it
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // If it's a relative path from our API, prefix message with BASE_URL
    // Ensure the path starts with a slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${BASE_URL}${cleanPath}`;
};
