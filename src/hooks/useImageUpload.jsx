import { useState, useCallback } from 'react';

const useImageUpload = () => {
  const [imageBase64, setImageBase64] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return { imageBase64, setImageBase64, imageFile, handleImageChange };
};

export default useImageUpload;
