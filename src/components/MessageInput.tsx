import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

function MessageInput({
  sendMessage,
  message,
  setMessage,
  image,
  setImage,
}: any) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<any>(false);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const storage = getStorage(app);

  const handleFileChange = (e: any) => {
    setUploadProgress(0);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    setUploadProgress(0)
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
        // You might want to handle the error state here
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            setFile(null);
            setImage(downloadURL);
            setImagePreview(null);
            setOpenImageModal(false);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error.message);
            // You might want to handle the error state here
          });
      }
    );
  };

  const uploadImage = () => {
    handleUpload();
  };

  const handleEmojiClick = (emojiData: any, event: any) => {
    // Append the selected emoji to the message state
    setMessage((prevMessage: any) => prevMessage + emojiData.emoji);
  };

  return (
    <form
      className="relative p-4 bg-slate-200 shadow-top dark:bg-slate-800 dark:shadow-topDark "
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}>
     <div className="flex items-center relative">
     <div className="mr-2 ">
        <FaPaperclip
          onClick={() => setOpenImageModal(true)}
          className={`text-2xl ${
            image ? "text-blue-500" : "text-gray-400"
          }  cursor-pointer  xs:text-xl xxs:text-base `}
        />
      </div>
      {/* Emoji Picker Button */}
      <button
        type="button"
        className="text-2xl xs:text-xl xxs:text-base"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😊
      </button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="w-[95%] text-xl xs:text-lg xxs:text-base border-none mr-4 px-2 xs:px-1 outline-none bg-transparent"
      />

     <button type="submit" className="mr-2">
        <FaPaperPlane className="text-2xl xs:text-xl xxs:text-base text-blue-500 dark:text-blue-600 cursor-pointer" />
      </button>
     </div>


      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 p-2 lg:scale-90 lg:bottom-10 xxs:scale-75  xxs:-right-11 xxs:bottom-1  lg:-right-5">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            //@ts-ignore
            disableAutoFocus={true}
            className=""
          />
          <div
            className="absolute -top-2 -left-2 p-1 bg-slate-200 dark:bg-white rounded-[50%] cursor-pointer"
            onClick={() => setShowEmojiPicker(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#888888] dark:text-[#303456]">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      <dialog className="modal" open={openImageModal}>
        <div className="modal-box xxs:p-4 border-2 border-solid border-slate-200 overflow-hidden">
          <form>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Uploaded"
                width={100}
                height={100}
                className="max-h-60 w-60 mb-4"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="xs:block xs:mb-2"
            />
            {uploadProgress > 0 && (
              <div className="hidden xs:flex xs:items-center">
                <progress value={uploadProgress} max="100"></progress>{" "}
                <span>{uploadProgress?.toFixed(2)}%</span>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                if(uploadProgress > 0 && uploadProgress < 100){
                  e.preventDefault()
                  return
                }
                uploadImage();
              }}
              className={`btn btn-sm btn-primary xs:w-full ${
                uploadProgress == 100 && "pointer-events-none"
              }`}>
              {uploadProgress == 100 ? "Uploaded" : (uploadProgress > 0 && uploadProgress < 100) ? "Uploading" : "Upload"}
            </button>

            {uploadProgress > 0 && (
              <div className="flex items-center xs:hidden">
                <progress
                  value={uploadProgress}
                  max="100"
                  className=""></progress>{" "}
                <span>{uploadProgress?.toFixed(2)}%</span>
              </div>
            )}
          </form>
          <button
            type="button"
            onClick={() => setOpenImageModal(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 xs:right-0 xs:top-0">
            ✕
          </button>
        </div>
      </dialog>
    </form>
  );
}

export default MessageInput;
