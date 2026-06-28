export async function readJsonResponse<T = Record<string, unknown>>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(`Máy chủ phản hồi rỗng (${res.status}). Hãy thử tải lại trang hoặc khởi động lại dev server.`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Phản hồi không hợp lệ từ máy chủ (${res.status}).`);
  }
}
