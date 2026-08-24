interface UploadResponse {
  imageUrl: string;
}

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const uploadScreenshot =
  async (
    file: File,
  ): Promise<string> => {
    if (
      !ALLOWED_TYPES.includes(
        file.type,
      )
    ) {
      throw new Error(
        'Unsupported image type.',
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      throw new Error(
        'Image exceeds maximum size.',
      );
    }

    const apiUrl =
      import.meta.env
        .VITE_DEMO_API_URL;

    if (!apiUrl) {
      throw new Error(
        'VITE_DEMO_API_URL is not configured.',
      );
    }

    const response =
      await fetch(
        `${apiUrl}/uploads`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              file.type,
          },

          body: file,
        },
      );

    if (!response.ok) {
      throw new Error(
        'Unable to upload screenshot.',
      );
    }

    const data =
      await response.json() as UploadResponse;

    return data.imageUrl;
  };