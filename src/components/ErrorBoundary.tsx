import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-stone-800">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-6 shadow-md text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">
                Đã xảy ra sự cố khi tải trang
              </h2>
              <p className="text-sm text-stone-600">
                Ứng dụng vừa gặp lỗi xử lý tạm thời. Nhấn nút bên dưới để khôi phục ngay trạng thái hoạt động bình thường.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-xs transition-all active:scale-95 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi phục ứng dụng</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
