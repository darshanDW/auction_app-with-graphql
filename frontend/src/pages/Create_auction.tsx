import React, { useState } from 'react';
import { Createauction } from '../graphql/Mutation';
import { useMutation } from '@apollo/client';
import axios from 'axios';

export interface FormData {
  itemName: string;
  startingPrice: number;
  endDate: string; // ISO 8601 format
  imageUrl: string;
  imagePublicId: string;
}

const Create_auction = () => {



  const [createauction, { data, error, loading }] = useMutation(Createauction);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    itemName: '',
    startingPrice: 0,
    endDate: new Date().toISOString(),
    imageUrl: '',
    imagePublicId: '',
  });

  const uploadToCloudinary = async (file: File, resourceType: string) => {
    const cloudinaryConfig = {
      upload_preset: 'ml_default',
      cloud_name: 'doavaeyri',
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.upload_preset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/upload`,
        formData
      );
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Cloudinary upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let { imageUrl, imagePublicId } = formData;

      // Upload image if file is provided
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile, 'image');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      // Mutation variables
      const variables = {
        ...formData,
        imageUrl,
      };

      await createauction({ variables });
      if (data) {
        console.log('Auction created successfully:', data);

      }
    } catch (err) {
      console.error('Error creating auction:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'startingPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Item Name:
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Starting Price:
          <input
            type="number"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          End Date:
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate.slice(0, 16)} // Convert ISO 8601 to 'YYYY-MM-DDTHH:mm'
            onChange={(e) => {
              const isoDate = new Date(e.target.value).toISOString();
              setFormData((prev) => ({ ...prev, endDate: isoDate }));
            }}
            required
          />
        </label>

        <input
          type="file"
          accept="image/*"
          id="image-upload"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="image-upload">
          <button type="button">Upload Image</button>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default Create_auction;
