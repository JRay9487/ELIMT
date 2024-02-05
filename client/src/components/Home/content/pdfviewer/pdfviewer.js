import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Paper from "@mui/material/Paper";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./pdfviewer.css";

// 設置 PDF.js 的工作人員路徑
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PdfViewer({ pdffile }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  //滑鼠位置檢測
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <Paper
      className="paper"
      sx={{ maxWidth: 600, margin: "auto", overflow: "hidden" }}
    >
      <div
        className="pdf-viewer-container"
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <Document file={pdffile} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>

        {isMouseOver && (
          <div className="button-container">
            <div>
              <button
                className="pdfnav"
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                {"<"}
              </button>
              <p className="pdfnav-text">
                {pageNumber || (numPages ? 1 : "--")} / {numPages || "--"}
              </p>
              <button
                className="pdfnav"
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Paper>
  );
}
