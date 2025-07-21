import { useCallback, useMemo, useRef, useState } from "react";

// 定数とタイプ定義
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "video/mp4", // 修正: image/mp4 → video/mp4
  "video/quicktime",
  "application/pdf",
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

export type AcceptedFileType = (typeof ACCEPTED_FILE_TYPES)[number];

export interface DropzoneConfig {
  maxFileSize?: number;
  maxFiles?: number;
  acceptedTypes?: readonly string[];
  onFilesChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export interface DropzoneState {
  files: File[];
  isDragActive: boolean;
  error: string | null;
  isLoading: boolean;
}

// ユーティリティ関数
const isAcceptedFileType = (fileType: string): fileType is AcceptedFileType =>
  ACCEPTED_FILE_TYPES.includes(fileType as AcceptedFileType);

const validateFiles = (
  files: File[],
  config: Required<DropzoneConfig>,
): { validFiles: File[]; errors: string[] } => {
  const errors: string[] = [];
  const validFiles: File[] = [];

  if (files.length > config.maxFiles) {
    errors.push(`最大${config.maxFiles}ファイルまでアップロード可能です`);
    return { validFiles: [], errors };
  }

  for (const file of files) {
    if (!isAcceptedFileType(file.type)) {
      errors.push(`${file.name}: サポートされていないファイル形式です`);
      continue;
    }

    if (file.size > config.maxFileSize) {
      errors.push(
        `${file.name}: ファイルサイズが制限を超えています (最大${Math.round(config.maxFileSize / 1024 / 1024)}MB)`,
      );
      continue;
    }

    validFiles.push(file);
  }

  return { validFiles, errors };
};

const createFileInput = (
  acceptedTypes: readonly string[],
  multiple: boolean,
): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = multiple;
  input.accept = acceptedTypes.join(",");
  input.style.display = "none";
  return input;
};

// メインフック
export const useDropzone = (userConfig: DropzoneConfig = {}) => {
  // 設定のマージ
  const config = useMemo<Required<DropzoneConfig>>(
    () => ({
      maxFileSize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
      acceptedTypes: ACCEPTED_FILE_TYPES,
      onFilesChange: () => {},
      onError: () => {},
      ...userConfig,
    }),
    [userConfig],
  );

  // 状態管理
  const [state, setState] = useState<DropzoneState>({
    files: [],
    isDragActive: false,
    error: null,
    isLoading: false,
  });

  const dragCounterRef = useRef(0);

  // ファイル処理の共通ロジック
  const processFiles = useCallback(
    (files: File[]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { validFiles, errors } = validateFiles(files, config);

        if (errors.length > 0) {
          const errorMessage = errors.join(", ");
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
          }));
          config.onError(errorMessage);
          return;
        }

        setState((prev) => ({
          ...prev,
          files: validFiles,
          error: null,
          isLoading: false,
        }));

        config.onFilesChange(validFiles);
      } catch (error) {
        const errorMessage = "ファイルの処理中にエラーが発生しました";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        config.onError(errorMessage);
      }
    },
    [config],
  );

  // イベントハンドラー
  const preventDefaults = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      preventDefaults(e);
      dragCounterRef.current++;

      if (dragCounterRef.current === 1) {
        setState((prev) => ({ ...prev, isDragActive: true }));
      }
    },
    [preventDefaults],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      preventDefaults(e);
      dragCounterRef.current--;

      if (dragCounterRef.current === 0) {
        setState((prev) => ({ ...prev, isDragActive: false }));
      }
    },
    [preventDefaults],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      preventDefaults(e);
      // ドロップ効果を設定
      e.dataTransfer.dropEffect = "copy";
    },
    [preventDefaults],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      preventDefaults(e);
      dragCounterRef.current = 0;

      setState((prev) => ({ ...prev, isDragActive: false }));

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [preventDefaults, processFiles],
  );

  const handleClick = useCallback(() => {
    const input = createFileInput(config.acceptedTypes, config.maxFiles > 1);

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const selectedFiles = Array.from(target.files);
        processFiles(selectedFiles);
      }
      // クリーンアップ
      document.body.removeChild(input);
    };

    // DOMに一時的に追加（一部ブラウザで必要）
    document.body.appendChild(input);
    input.click();
  }, [config.acceptedTypes, config.maxFiles, processFiles]);

  // ファイルを削除する関数
  const removeFile = useCallback(
    (index: number) => {
      setState((prev) => {
        const newFiles = prev.files.filter((_, i) => i !== index);
        config.onFilesChange(newFiles);
        return { ...prev, files: newFiles };
      });
    },
    [config],
  );

  // ファイルをクリアする関数
  const clearFiles = useCallback(() => {
    setState((prev) => ({ ...prev, files: [], error: null }));
    config.onFilesChange([]);
  }, [config]);

  // エラーをクリアする関数
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClick,
    removeFile,
    clearFiles,
    clearError,
    acceptedTypes: config.acceptedTypes,
    maxFileSize: config.maxFileSize,
    maxFiles: config.maxFiles,
  };
};
