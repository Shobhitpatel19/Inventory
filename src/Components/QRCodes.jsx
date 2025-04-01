import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import configs, { getParameterByName } from "../Constants";
import html2pdf from 'html2pdf.js';
import "./QRCodes.css"
function QRCodes() {
  const [logo, setLogo] = useState("");
  const contentRef = useRef(null);
  let merchantData = sessionStorage.getItem("merchantData") ? JSON.parse(sessionStorage.getItem("merchantData")) : null;

  const merchCode = merchantData && merchantData.merchantCode;

  const configs = JSON.parse(localStorage.getItem("configs"))

  // configs.productName
  const sokQR = `${configs.sokUrl}?merchantCode=${merchCode}&isScan=true`
  const emenu = `${configs.emenuUrl}?merchantCode=${merchCode}&isScan=true`
  const kot = `https://signage-common-assets.s3.ap-south-1.amazonaws.com/plugins/kitchen-side-token/tokens.html?serve_url=${configs.baseURL}&merchantCode=${merchCode}`

  let companyLogo = "/images/logo.png";



  function base64Converter(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  base64Converter(merchantData ? merchantData.logoImg : "", function (dataUrl) {
    setLogo(dataUrl);
  })



  const handleDownload = () => {
    const element = document.getElementById("qr-img1");
    const down_logo = document.getElementById("download_logo1")
    down_logo.style.visibility = "hidden";
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const x = (pdfWidth - imgWidth * scaleFactor) / 2;
      const y = (pdfHeight - imgHeight * scaleFactor) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth * scaleFactor, imgHeight * scaleFactor);
      pdf.save("qrcode.pdf");
      down_logo.style.visibility = "visible";
    });
  };



  const handleDownload1 = () => {
    const element = document.getElementById("qr-img2");
    const down_logo = document.getElementById("download_logo2")
    down_logo.style.visibility = "hidden";
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const x = (pdfWidth - imgWidth * scaleFactor) / 2;
      const y = (pdfHeight - imgHeight * scaleFactor) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth * scaleFactor, imgHeight * scaleFactor);
      pdf.save("qrcode.pdf");
      down_logo.style.visibility = "visible";
    });
  };
  const handleDownload2 = () => {
    const element = document.getElementById("qr-img3");
    const down_logo = document.getElementById("download_logo3")
    down_logo.style.visibility = "hidden";
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const x = (pdfWidth - imgWidth * scaleFactor) / 2;
      const y = (pdfHeight - imgHeight * scaleFactor) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth * scaleFactor, imgHeight * scaleFactor);
      pdf.save("qrcode.pdf");
      down_logo.style.visibility = "visible";
    });
  };
  return (
    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", overflow: "auto", height: "87vh" }}>

      <div
        id="qr-img1"
        ref={contentRef}
        style={{ backgroundImage: 'url("./images/self_orderBG.jpeg")', }}>

        <div style={{ textAlign: "end", padding: "5px", height: "50px" }} >
          <FileDownloadIcon fontSize="large" color="primary" id="download_logo1" cursor="pointer" onClick={handleDownload} />

        </div>

        <div style={{ height: "210px" }}></div>
        <div
        >
          <QRCode
            id="qrcode1"
            size={556}
            value={sokQR}
          />
          <div className="logos1">
            <img src={logo && logo} />
            <div>
              <span style={{ color: "#fff", display: "flex", flexDirection: "column", fontStyle: "italic" }}>Powered by</span>
              <h5 style={{ color: "#fff", fontSize: "27px", margin: "0px" }}>{configs.productName}</h5>
            </div>
          </div>


        </div>

        {/* <Button variant="contained" color="success" onClick={handleDownload}>
          Download
        </Button> */}
        <div>
        </div>
      </div>

      <div id="qr-img2" style={{ backgroundImage: 'url("./images/eMenuBG.jpeg")', }}>

        <div style={{ textAlign: "end", padding: "5px", height: "50px" }}>
          <FileDownloadIcon fontSize="large" color="primary" id="download_logo2" cursor="pointer" onClick={handleDownload1} />

        </div>
        <div style={{ height: "210px" }}></div>
        <div>
          <QRCode
            id="qrcode2"
            size={556}
            value={emenu}
          />
          <div className="logos2">
            <img src={logo && logo} />

            <div>
              <span style={{ color: "#fff", display: "flex", flexDirection: "column", fontStyle: "italic" }}>Powered by</span>
              <h5 style={{ color: "#fff", fontSize: "27px", margin: "0px" }}>{configs.productName}</h5>
            </div>
          </div>

        </div>
        {/* <Button variant="contained" color="success" onClick={handleDownload1}>
          Download
        </Button> */}
      </div>

      <div id="qr-img3" style={{ backgroundImage: 'url("./images/kitchenBG.jpeg")', }}>

        <div style={{ textAlign: "end", padding: "5px", height: "50px" }}>
          <FileDownloadIcon fontSize="large" color="primary" id="download_logo3" cursor="pointer" onClick={handleDownload2} />

        </div>

        <div style={{ height: "210px" }}></div>
        <div  >

          <QRCode
            id="qrcode3"
            size={556}
            value={kot}
          />

          <div className="logos3">
            <img src={logo && logo} />
            <div>
              <span style={{ color: "#fff", display: "flex", flexDirection: "column", fontStyle: "italic" }}>Powered by</span>
              <h5 style={{ color: "#fff", fontSize: "27px", margin: "0px" }}>{configs.productName}</h5>
            </div>
          </div>

        </div>
        {/* <Button variant="contained" color="success" >
          Download
        </Button> */}
      </div>
    </div>

  );
}

export default QRCodes;
