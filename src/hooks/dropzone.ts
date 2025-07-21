import { useState } from "react";

const FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/mp4",
  "vide/quicktime",
  "application/pdf",
] as const;

export type AvailableFileType = (typeof FILE_TYPES)[number];

const isAvailableFileType = (fileType: string): fileType is AvailableFileType =>
  FILE_TYPES.includes(fileType as AvailableFileType);

export const useDropzone = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = [...e.dataTransfer.files].filter((file) =>
      isAvailableFileType(file.type),
    );

    console.log(files);

    setFiles(files);
    setIsFocused(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFocused(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFocused(true);
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = FILE_TYPES.join(",");

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const selectedFiles = Array.from(target.files).filter((file) =>
          isAvailableFileType(file.type),
        );
        setFiles(selectedFiles);
      }
    };

    input.click();
  };
  return {
    files,
    isFocused,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleDragEnter,
    handleClick,
  };
};
