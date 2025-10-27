// Upload configuration
export const uploadConfig = {
  // Change this URL based on your deployment
  uploadUrl: process.env.REACT_APP_UPLOAD_URL || 'https://st.osamaqaseem.online/upload.php',
  
  // File validation
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Upload settings
  maxImages: 10,
};
