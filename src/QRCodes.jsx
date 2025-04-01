import React from "react";
import QRCode from "react-qr-code";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
function QRCodes() {
  let merchantData=sessionStorage.getItem("merchantData")?JSON.parse(sessionStorage.getItem("merchantData")):null;
  
   const merchCode = merchantData && merchantData.merchantCode;

const configs = JSON.parse(localStorage.getItem("configs"))
console.log(configs)

const sokQR = `${configs.sokUrl}?merchantCode=${merchCode}&isScan=true`
const emenu = `${configs.emenuUrl}?merchantCode=${merchCode}&isScan=true`
const kot = `${configs.kitchenTokenUrl}?serve_url=${configs.baseURL}&merchantCode=${merchCode}`
  const handleDownload = () => {
    console.log("i am downloading")
    const element = document.getElementById("qr-img1");
    console.log(element)
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
    });
  };
  const handleDownload1 = () => {
    console.log("i am downloading")
    const element = document.getElementById("qr-img2");
    console.log(element)
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
    });
  };
  return (
    <div  style={{ width: "100%", display: "flex",flexWrap:"wrap",justifyContent:"center",overflow:"auto",height:"100%" }}>

<div style={{textAlign:"center",width:"400px",height:"800px"}}>
<div
        id="qr-img1"
        style={{
          border: "1px dotted",
          padding: "10px",
          margin: "10px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "2.0rem" }}>{"SCAN TO ORDER"}</h1>
        <QRCode
          id="qrcode"
          size={556}
          style={{
            height: "250px",
            width: "250px",
          }}
          value={sokQR}
        />
        <h1>{"SELF SERVICE QR"}</h1>
        <p>{"Scan with Mobile Camera"}</p>
        <p>{"[Gogle LENS, Scanner etc]"}</p>

       
      </div>
      <Button variant="contained" color="success" onClick={handleDownload}>
          Download
        </Button>
</div>

<div style={{textAlign:"center",width:"400px",height:"800px"}}>
<div
        id="qr-img2"
        style={{
          border: "1px dotted",
          padding: "10px",
          margin: "10px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "2.0rem" }}>{"SCAN FOR MENU"}</h1>
        <QRCode
          id="qrcode"
          size={556}
          style={{
            height: "250px",
            width: "250px",
          }}
          value={emenu}
        />
        <h1>{"e-Menu QR"}</h1>
        <p>{"Scan with Mobile Camera"}</p>
        <p>{"[Gogle LENS, Scanner etc]"}</p>
     
      </div>
      <Button variant="contained" color="success" onClick={handleDownload1}>
          Download
        </Button>
</div>
<div style={{textAlign:"center",width:"400px",height:"800px"}}>
<div
        id="qr-img3"
        style={{
          border: "1px dotted",
          padding: "10px",
          margin: "10px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "2.0rem" }}>{"SCAN FOR KITCHEN TOKEN (KOT)"}</h1>
        <QRCode
          id="qrcode"
          size={556}
          style={{
            height: "250px",
            width: "250px",
          }}
          value={kot}
        />
        <h1>{"Kitchen Token QR"}</h1>
        <p>{"Scan with Mobile Camera"}</p>
        <p>{"[Gogle LENS, Scanner etc]"}</p>
     
      </div>
      <Button variant="contained" color="success" onClick={handleDownload1}>
          Download
        </Button>
</div>
</div>
    
  );
}

export default QRCodes;
