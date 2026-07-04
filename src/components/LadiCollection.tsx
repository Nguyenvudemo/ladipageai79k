import React, { useState, useEffect } from 'react';
import { Maximize2, X, Settings, Image as ImageIcon, Check, RotateCcw, ExternalLink } from 'lucide-react';

interface LadiItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

const DEFAULT_COLLECTION: LadiItem[] = [
  {
    id: 'ladi-1',
    title: 'Landing Page Mỹ Phẩm Vegan',
    category: 'Mỹ Phẩm & Làm Đẹp',
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-2',
    title: 'Landing Page Cà Phê Specialty',
    category: 'F&B - Trà sữa & Cà phê',
    imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-3',
    title: 'Landing Page Thiết Bị Công Nghệ',
    category: 'SaaS & Tech Gadget',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-4',
    title: 'Landing Page Thời Trang Minimalist',
    category: 'Thời Trang Cao Cấp',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-5',
    title: 'Landing Page Khóa Học Tiếng Anh',
    category: 'Giáo Dục & EdTech',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-6',
    title: 'Landing Page Thiết Kế Nội Thất',
    category: 'Kiến Trúc & Đồ Gia Dụng',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-7',
    title: 'Landing Page Gym & Thể Hình',
    category: 'Sức Khỏe & Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-8',
    title: 'Landing Page Khách Sạn & Resort',
    category: 'Du Lịch & Nghỉ Dưỡng',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ladi-9',
    title: 'Landing Page Spa & Chăm Sóc Da',
    category: 'Dịch Vụ Trị Liệu',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
  }
];

export default function LadiCollection() {
  const [items, setItems] = useState<LadiItem[]>(() => {
    const saved = localStorage.getItem('ladi_collection_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_COLLECTION;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [zoomItem, setZoomItem] = useState<LadiItem | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('ladi_collection_items', JSON.stringify(items));
  }, [items]);

  const handleUpdateUrl = (id: string, url: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: url } : item));
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, title: title } : item));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có muốn đặt lại bộ sưu tập ảnh về mặc định không?')) {
      setItems(DEFAULT_COLLECTION);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <section className="mt-16 relative">
      {/* Visual background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Templates Chuyển Đổi Cao
            </span>
            {/* Pulsing Hot badge */}
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.45)] border border-red-400/20 animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              <span>HOT 🔥</span>
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-space text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            BỘ SỰU TẬP LADIPAGE AI
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Tổng hợp những mẫu thiết kế landing page dọc tỉ lệ 9:16 tối ưu trải nghiệm di động, tăng tỷ lệ nhấp chuột và tối ưu quảng cáo vượt trội.
          </p>
        </div>
      </div>

      {/* Admin Panel */}
      {isAdminOpen && (
        <div className="mb-8 p-5 bg-slate-900/90 border border-indigo-500/30 rounded-2xl animate-fade-in space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5 font-space">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>QUẢN TRỊ VIÊN: TỰ CHÈN LINK ẢNH TÙY BIẾN</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Thay đổi các đường dẫn ảnh (URL) và tiêu đề dưới đây. Ảnh sẽ tự động cập nhật ngoài giao diện!
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition"
                title="Khôi phục ảnh mặc định"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Mặc định</span>
              </button>
              <button
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-bold transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu cấu hình</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs text-center font-medium animate-pulse">
              ✓ Đã lưu thay đổi vào Local Storage thành công!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item, index) => (
              <div key={item.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Mẫu số {index + 1}</span>
                  <span className="text-[9px] text-slate-500 font-mono italic">{item.category}</span>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-400">Tiêu đề mẫu</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Nhập tiêu đề..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-400">Đường dẫn hình ảnh (URL)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={item.imageUrl}
                      onChange={(e) => handleUpdateUrl(item.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500 font-mono truncate"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white flex items-center justify-center shrink-0"
                      title="Xem ảnh gốc"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3x3 Grid: 1 hàng 3 cột, tổng cộng 3 hàng (9 ảnh) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setZoomItem(item)}
            className="group relative bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer hover:border-indigo-500/45 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
          >
            {/* Top info overlay */}
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-slate-950/70 text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                {item.category}
              </span>
            </div>

            {/* Main Image */}
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Overlay with glass effect and zoom indicator */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Zoom Call to Action button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="w-12 h-12 bg-indigo-600/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 scale-75 group-hover:scale-100 transition-transform duration-300 border border-indigo-400/30">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <span className="text-white text-xs font-bold mt-2.5 tracking-wider font-space bg-slate-950/80 px-3 py-1 rounded-full border border-white/5 shadow">
                  BẤM ĐỂ ZOOM ẢNH
                </span>
              </div>
            </div>

            {/* Bottom Info text */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Tỷ lệ chuẩn 9:16 • Thiết kế bởi THONGUYENxAI
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal overlay */}
      {zoomItem && (
        <div 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 transition-all duration-300 animate-fade-in"
          onClick={() => setZoomItem(null)}
        >
          {/* Close button top right */}
          <button
            onClick={() => setZoomItem(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center border border-white/10 transition z-50 shadow-lg"
            aria-label="Đóng ảnh"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Container */}
          <div 
            className="relative flex flex-col items-center justify-center max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
          >
            {/* The zoomed image framed beautifully */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl shadow-indigo-500/10 max-h-[80vh] aspect-[9/16]">
              <img
                src={zoomItem.imageUrl}
                alt={zoomItem.title}
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Caption Info below the image */}
            <div className="mt-4 text-center space-y-1 max-w-sm px-4">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                {zoomItem.category}
              </span>
              <h4 className="text-base md:text-lg font-bold text-white leading-tight">
                {zoomItem.title}
              </h4>
              <p className="text-[11px] text-slate-400">
                Vuốt dọc mượt mà • Đã tối ưu tốc độ tải hình ảnh qua CDN AI.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
