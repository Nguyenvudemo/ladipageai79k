import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, HelpCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { AILandingPageData, ThemePreset } from '../types';

interface AIPageBuilderProps {
  onGenerationComplete: (data: AILandingPageData, stylePreset: ThemePreset) => void;
  isRegistered: boolean;
  onScrollToRegister: () => void;
}

export default function AIPageBuilder({ onGenerationComplete, isRegistered, onScrollToRegister }: AIPageBuilderProps) {
  const [niche, setNiche] = useState('');
  const [style, setStyle] = useState<ThemePreset>('modern');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [error, setError] = useState('');

  const styleDescriptions = {
    modern: {
      name: "Công Nghệ Hiện Đại",
      desc: "Tông màu neon, đen sâu, viền mờ ảo, phông Space Grotesk. Rất hợp cho công nghệ, phần mềm, SaaS."
    },
    minimalist: {
      name: "Tối Giản Tinh Tế",
      desc: "Trắng tinh khôi, xám thanh lịch, phông chữ Inter mảnh mai. Hợp với thời trang, nội thất, dịch vụ cao cấp."
    },
    warm: {
      name: "Thân Thiện Ấm Cúng",
      desc: "Màu kem nhạt, xanh lá mộc mạc, phông serif cổ điển. Thích hợp cho F&B, đồ hữu cơ, mỹ phẩm tự nhiên."
    },
    bold: {
      name: "Độc Đáo Phá Cách",
      desc: "Độ tương phản siêu cao, bo tròn mạnh, phông JetBrains Mono. Phù hợp cho agency sáng tạo, sự kiện."
    }
  };

  const loadingMessages = [
    "AI đang nghiên cứu hành vi khách hàng trong ngành của bạn...",
    "Đang phác thảo cấu trúc thẻ Heading H1, H2 tối ưu hóa SEO...",
    "Viết tiêu đề chính hấp dẫn bằng công thức thôi miên AIDA...",
    "Thiết kế 3 điểm cốt lõi lợi ích (Unique Selling Points)...",
    "Tạo lập 2 đánh giá khách hàng (Social Proof) chân thực...",
    "Soạn thảo câu hỏi thường gặp FAQs để giải quyết rào cản mua hàng...",
    "Hoàn thiện bộ thẻ Meta Title, Meta Description chuẩn SEO Google..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!niche.trim()) {
      setError('Vui lòng nhập lĩnh vực kinh doanh của bạn.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-ladipage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, style })
      });
      
      const resData = await response.json();
      if (resData.data) {
        onGenerationComplete(resData.data, style);
      } else {
        throw new Error(resData.error || 'Không thể tạo dữ liệu landing page.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Gặp sự cố kết nối AI. Đang hiển thị Landing Page mẫu chất lượng cao.');
    } finally {
      setIsLoading(false);
    }
  };

  const popularNiches = [
    "Bán Cà Phê Hạt Hữu Cơ",
    "Shop Hoa Tươi Sài Gòn",
    "Học Viện Tiếng Anh Trẻ Em",
    "Studio Chụp Ảnh Cưới",
    "Thương Hiệu Son Môi Thuần Chay",
    "Dịch Vụ Thiết Kế Nội Thất"
  ];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-space text-slate-900 tracking-tight">
            Trình Tạo Landing Page AI Thực Chiến
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mô tả lĩnh vực của bạn, AI sẽ tự động lập kế hoạch và sinh bố cục chuyển đổi cực nhanh.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Field */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Lĩnh vực kinh doanh hoặc sản phẩm/dịch vụ của bạn *
        </label>
        <div className="relative">
          <input
            type="text"
            disabled={isLoading}
            placeholder="Ví dụ: Cửa hàng bánh ngọt Pháp, Dịch vụ sửa chữa Laptop tại nhà..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-4 rounded-xl transition text-xs flex items-center gap-1.5 shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : (
              <>
                <span>Tạo Bố Cục AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Niche tags selector */}
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          <span className="text-[10px] text-slate-400 font-medium self-center mr-1">Ý tưởng gợi ý:</span>
          {popularNiches.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => setNiche(p)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Theme Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-slate-500" />
          <span>Lựa chọn phong cách thiết kế</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(styleDescriptions) as ThemePreset[]).map((key) => {
            const isSelected = style === key;
            return (
              <button
                key={key}
                type="button"
                disabled={isLoading}
                onClick={() => setStyle(key)}
                className={`text-left p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{styleDescriptions[key].name}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {styleDescriptions[key].desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay State */}
      {isLoading && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-4 animate-pulse">
          <div className="flex justify-center items-center gap-2">
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800">{loadingMessages[loadingMessageIdx]}</p>
            <p className="text-[10px] text-slate-400">Thời gian tạo dự kiến: 3 - 5 giây. Không đóng trình duyệt.</p>
          </div>
          
          {/* Mini Knowledge Tip Panel */}
          <div className="bg-indigo-50/70 border border-indigo-100/50 p-3 rounded-xl text-left text-[11px] text-indigo-800 max-w-md mx-auto space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-[9px] text-indigo-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Góc tối ưu Landing Page</span>
            </span>
            <p className="leading-relaxed">
              Bạn có biết? Giảm số lượng biểu mẫu đăng ký từ 5 xuống 3 trường thông tin giúp tăng tỷ lệ đăng ký biểu mẫu trung bình lên đến <strong>40%</strong>!
            </p>
          </div>
        </div>
      )}

      {/* Download Alert for non-registered users */}
      {!isRegistered && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-800">Đăng ký để mở khóa toàn bộ tính năng</h4>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Bạn vẫn có thể tạo và tùy chỉnh giao diện Landing Page AI. Hãy <strong>Đăng ký nhận Ebook 79K</strong> ở biểu mẫu phía trên để mở khóa tính năng <strong>Tải mã nguồn HTML tối ưu</strong> và chạy <strong>AI SEO Audit chuyên sâu</strong>!
            </p>
            <button
              onClick={onScrollToRegister}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5 pt-1"
            >
              <span>Đi đến Đăng ký miễn phí ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
