import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";
function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        {
          responseType: "blob",
        }
      );
      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log(url);
      const link = document.createElement("a");
      console.log(link);
      link.href = url;
      console.log(link);
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      console.log(link);
      document.body.appendChild(link);
      console.log(link);
      link.click();
      link.parentNode.removeChild(link);
      setSelectedFile(null);
      setDownloadError("");
      setConvert("File Converted Successfully");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status == 400) {
        setDownloadError("Error occurred: ", error.response.data.message);
      } else {
        setConvert("");
      }
    }
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
        <div className="flex h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word to PDF Online
            </h1>
            <p className="text-sm text-center mb-5">
              Easily convert Word documents to PDF format online, without having
              to install any software.
            </p>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="FileInput"
              />
              <label
                htmlFor="FileInput"
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
              >
                <FaFileWord className="text-3xl mr-3" />
                <span className="text-2xl mr-2 ">
                  {selectedFile ? selectedFile.name : "Choose File"}
                </span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg"
              >
                Convert File
              </button>
              {convert && (
                <div className="text-green-500 text-center">{convert}</div>
              )}
              {downloadError && (
                <div className="text-red-500 text-center">{downloadError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
