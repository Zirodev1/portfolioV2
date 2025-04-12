import axios from 'axios';

export const uploadImage = async (img) => {
  let imgUrl = null;
  
  try {
    // Create form data to send the image file
    const formData = new FormData();
    formData.append('image', img);
    
    // Upload the image through our backend server
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/upload/image`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Get the image URL from the response
    imgUrl = response.data.imageUrl;
  } catch (err) {
    console.error("Error uploading image:", err);
  }
  
  return imgUrl;
};