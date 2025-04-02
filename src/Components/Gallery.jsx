import React, { useEffect, useState } from "react";
import axios from "axios";
import configs from "../Constants";
import { Radio, Backdrop, CircularProgress, Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

let baseURL = configs.baseURL;

function Gallery({ onSelectImage, searchQuery}) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    // console.log("-------------------------"+`${baseURL}/api/products/images`);
    setLoading(true);
    axios
      .get(`${baseURL}/api/products/images`)
      .then((response) => {
        setImages(response.data);
        setFilteredImages(response.data);
        setTotalPages(Math.ceil(response.data.length / 10));
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredImages(images);
    } else {
      setFilteredImages(
        images.filter((image) =>
          image.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, images]);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onSelectImage(image);
  };

  const itemsPerPage = 10;
  const totalPagesCalc = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imagesToDisplay = filteredImages.slice(startIndex, endIndex);

  const handleNextClick = () => {
    if (currentPage < totalPagesCalc) setCurrentPage(currentPage + 1);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Gallery</h2>



        <div style={{ display: "flex", alignItems: "center" }}>
          <NavigateBeforeIcon
            onClick={handlePrevClick}
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          />
          <span>
            {currentPage} of {totalPagesCalc}
          </span>
          <NavigateNextIcon
            onClick={handleNextClick}
            disabled={currentPage === totalPagesCalc}
            style={{
              cursor: currentPage === totalPagesCalc ? "not-allowed" : "pointer",
            }}
          />
        </div>
      </div>

      {/* Gallery */}
      {loading ? (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : imagesToDisplay.length === 0 ? (
        <div>No images found</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {imagesToDisplay.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "150px",
              }}
            >
              <Radio
                color="primary"
                checked={selectedImage === image}
                onChange={() => handleImageSelect(image)}
                style={{ position: "absolute", top: 0, left: 0 }}
              />
              <img
                // src={`${baseURL}/${image.image}`}
                src = {`${image.image}`}
                alt={image.name}
                onError={(e) => {
                  e.target.src = "./images/blank.jpg";
                }}
                width="150px"
                height="150px"
                style={{ padding: "10px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
