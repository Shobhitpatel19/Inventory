import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import configs from "../Constants";
import { Radio } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CircularProgress from "@mui/material/CircularProgress";
let baseURL = configs.baseURL;

function Gallery({ onSelectImage, searchQuery }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mojahid
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage2, setCurrentPage2] = useState(1);
  useEffect(() => {
    axios
      .get(baseURL+"/api/products/images?foodname="+searchQuery.toLowerCase())
      .then((response) => {
        console.log(response.data);
        setImages(response.data);
        setTotalPages(Math.ceil(response.data.length / 10));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, []);
  console.log("images", images);
  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onSelectImage(image);
  };

  // Mojahid
  // const filteredImages = images.filter((image) =>
  //   image.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const totalPages3 = Math.ceil(images.length / 10);
  //Mojahid added
  const itemsPerPage2 = 10;
  const startIndex2 = (currentPage2 - 1) * itemsPerPage2;
  const endIndex2 = startIndex2 + itemsPerPage2;
  const filteredImagesPerPage = images.slice(startIndex2, endIndex2);

  const preDisable2 = currentPage2 === 1;
  const nextDisable2 = currentPage2 === totalPages3;

  const handleNextClick2 = () => {
    if (currentPage2 < totalPages3) {
      setCurrentPage2(currentPage2 + 1);
    }
  };

  const handlePrevClick2 = () => {
    if (currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  };

  /////////////////////////////
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const preDisable = currentPage === 1;
  const nextDisable = currentPage === totalPages;

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = images.slice(startIndex, endIndex);
  console.log("itemsToDisplay",itemsToDisplay);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Gallery</h2>
        {searchQuery.length == "" ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <>
              <NavigateBeforeIcon
                onClick={handlePrevClick}
                disabled={preDisable}
                style={{ cursor: "pointer" }}
              />

              <span>
                {currentPage} of {totalPages}
              </span>
              <NavigateNextIcon
                onClick={handleNextClick}
                disabled={nextDisable}
                style={{ cursor: "pointer" }}
              />
            </>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <NavigateBeforeIcon
              onClick={handlePrevClick2}
              disabled={preDisable2}
              style={{ cursor: "pointer" }}
            />

            <span>
              {currentPage2} of {totalPages3}
            </span>

            <NavigateNextIcon
              onClick={handleNextClick2}
              disabled={nextDisable2}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>
      {!searchQuery.length ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {itemsToDisplay.map((image, index) => (
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
                  src={`${image.image}`}
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
        </>
      ) : (
        <>
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : filteredImagesPerPage.length === 0 ? (
            <div>No images found</div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {filteredImagesPerPage.map((image, index) => (
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
                    src={`${baseURL}/${image.image}`}
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
        </>
      )}
    </div>
  );
}

export default Gallery;
