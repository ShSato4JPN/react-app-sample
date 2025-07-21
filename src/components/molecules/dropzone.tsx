"use client";

import clsx from "clsx";
import { CloudUpload } from "lucide-react";
import { type ReactNode } from "react";

import { useDropzone } from "@/hooks/dropzone";

type DropzoneRootProps = {
  children: ReactNode;
  isFocused: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: (e: React.DragEvent<HTMLDivElement>) => void;
};

function DropzoneRoot({
  children,
  isFocused,
  onDrop,
  onDragOver,
  onDragLeave,
  onDragEnter,
  onClick,
}: DropzoneRootProps) {
  return (
    <div
      className={clsx(
        "border-4 border-dotted rounded-lg grid place-items-center p-20 cursor-pointer",
        isFocused && "border-solid border-blue-400",
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

type DropzoneContentProps = {
  children: ReactNode;
  files: File[];
};

function DropzoneContent({ children, files }: DropzoneContentProps) {
  const fileNames = files.map((file) => file.name).join(",");

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none">
      {files.length === 0 ? children : <div>{fileNames}</div>}
    </div>
  );
}

export default function Dropzone() {
  const {
    files,
    isFocused,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleDragEnter,
    handleClick,
  } = useDropzone();

  return (
    <DropzoneRoot
      isFocused={isFocused}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onClick={handleClick}
    >
      <DropzoneContent files={files}>
        <CloudUpload />
        <span>デバイスからアップロード</span>
      </DropzoneContent>
    </DropzoneRoot>
  );
}
