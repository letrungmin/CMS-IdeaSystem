import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Nhận diện mục tiêu: Người dùng đang muốn đi đâu?
  const path = request.nextUrl.pathname;

  // 2. Vùng cấm địa: Các trang cần bảo vệ
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/ideas');

  // 3. Xét hỏi Thẻ bài (Token) trong Cookies
  const token = request.cookies.get('token')?.value;

  // 4. Nếu cố tình đột nhập vùng cấm mà không có Thẻ bài -> Đuổi về trang Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Nếu đã có Thẻ bài mà lại lảng vảng ngoài cổng Login -> Mời thẳng vào Dashboard
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Nếu mọi thứ hợp lệ, cho phép thông quan
  return NextResponse.next();
}

// 6. Tối ưu hóa: Chỉ gọi Cấm vệ quân dậy khi người dùng vào các đường dẫn này
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/ideas/:path*', 
    '/login'
  ],
};