import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import "../App.css";
import configs from "../Constants";

const PromotionPage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "xyz";

  let baseURL = configs.baseURL;
  let cmsUrl = `${configs.cmsUrl}`;
  let staticURL = configs.staticSer;
  let userToken = sessionStorage.getItem("token") || "";

  useEffect(() => {
    const getImg = async () => {
      try {
        const res = await axios.get(`${cmsUrl}/api/user/media`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (res.data && res.data.mediaData) {
          // Filter out only the files that contain .img, .jpg, or .png
          const extractedImages = res.data.mediaData
            .filter((item) => {
              const fileName = item.original_file_name.toLowerCase();
              return (
                fileName.includes(".img") ||
                fileName.includes(".jpg") ||
                fileName.includes(".png")
              );
            })
            .map((item) => item.original_file_name);

          setAvailableImages(extractedImages);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };

    getImg();
  }, [cmsUrl, userToken]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/promos?merchantCode=${merchCode}`
        );

        if (res.data.length > 0) {
          // Limit to only the number of images received (max 5)
          const updatedImages = res.data.slice(0, 5).map((item) => ({
            id: item.id || "",
            url: item.url || "",
          }));

          setSelectedImages(updatedImages);
        } else {
          setSelectedImages([]); // If no images, keep it empty
        }
      } catch (err) {
        console.log("Error fetching selected images:", err);
      }
    };

    fetchImages();
  }, [merchCode]);

  const handleSelectImage = (id) => {
    setCurrentId(id);
    setOpenPopup(true);
  };

  const handleAddPromotion = () => {
    setCurrentId(null); // Set null to indicate adding a new promotion
    setOpenPopup(true);
  };

  const handleImageClick = async (image) => {
    if (currentId === null) {
      // Create a new promotion
      try {
        const imageUrl = `${staticURL}/uploads/${image}`;
        const response = await axios.post(
          `${baseURL}/api/promos`,
          { url: imageUrl, userId: merchCode },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        console.log("New promotion created:", response.data);

        setSelectedImages([
          ...selectedImages,
          { id: response.data.id, url: imageUrl },
        ]);
      } catch (err) {
        console.error("Error creating new promotion:", err);
      }
    } else {
      // Update existing promotion
      const existingImageIndex = selectedImages.findIndex(
        (img) => img.id === currentId
      );
      const updatedImages = [...selectedImages];

      if (existingImageIndex !== -1) {
        updatedImages[existingImageIndex] = {
          ...updatedImages[existingImageIndex],
          url: `${staticURL}/uploads/${image}`,
        };

        try {
          await axios.put(
            `${baseURL}/api/promos/${currentId}`,
            { url: `${staticURL}/uploads/${image}`, userId: merchCode },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          console.log("Image updated successfully");
        } catch (err) {
          console.error("Error updating selected image:", err);
        }
      }
      setSelectedImages(updatedImages);
    }

    setOpenPopup(false);
  };

  console.log("available Images",availableImages);

  return (
    <div className="promotion-container">
      <div className="header">
        <div>
          <h4>Promotion</h4>
          <p style={{ color: "#3c3c3d", marginLeft: "5px" }}>
            Max Upto 5 images
          </p>
        </div>
        {selectedImages.length < 5 && (
          <button className="add-promotion-button" onClick={handleAddPromotion}>
            + Add Promotion
          </button>
        )}
      </div>

      <div className="pro-imag-cnt">
        <div className="promotion-grid">
          {selectedImages.map((imageData, index) => (
            <div key={index} className="promotion-item">
              <img
                src={imageData.url || "https://via.placeholder.com/150"}
                alt={`Image ${index + 1}`}
                className="promotion-image"
              />
              <button
                className="promotion-button"
                onClick={() => handleSelectImage(imageData.id)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Selection Popup */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Select an Image</DialogTitle>
        <DialogContent>
          <div className="image-selection-grid">
            {availableImages.length > 0 ? (
              availableImages.map((image, index) => (
                <img
                  key={index}
                  src={`${staticURL}/uploads/${image}`}
                  alt=""
                  className="image-option"
                  onClick={() => handleImageClick(image)}
                  style={{
                    width: "100px",
                    height: "100px",
                    cursor: "pointer",
                    margin: "5px",
                  }}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionPage;
