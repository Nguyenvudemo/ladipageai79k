import React, { useState } from 'react';
import { BookOpen, CheckCircle, Download, FileText, ArrowRight, Gift, Bookmark, Award, Users, Settings, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Lead } from '../types';

interface EbookSectionProps {
  onRegister: (lead: Lead) => void;
  registeredLead: Lead | null;
}

export default function EbookSection({ onRegister, registeredLead }: EbookSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    niche: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [showChapters, setShowChapters] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheetSyncResult, setSheetSyncResult] = useState<{ status: string; error?: string | null } | null>(null);

  const validatePhone = (value: string) => {
    const clean = value.replace(/\s+/g, '');
    if (!clean) return "Số điện thoại là bắt buộc.";
    if (!/^\d+$/.test(clean)) return "Số điện thoại chỉ được chứa ký tự số (không nhập chữ/text).";
    if (!clean.startsWith('0')) return "Số điện thoại phải bắt đầu bằng số 0.";
    if (clean.length !== 10) return `Số điện thoại phải có đúng 10 số (hiện tại: ${clean.length} số).`;
    return "";
  };

  const validateEmail = (value: string) => {
    const clean = value.trim();
    if (!clean) return "Địa chỉ Email là bắt buộc.";
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(clean)) {
      return "Gmail không đúng định dạng mẫu chuẩn (...@gmail.com).";
    }
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '');
    setFormData(prev => ({ ...prev, phone: val }));
    const err = validatePhone(val);
    setFieldErrors(prev => ({ ...prev, phone: err }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setFormData(prev => ({ ...prev, email: val }));
    const err = validateEmail(val);
    setFieldErrors(prev => ({ ...prev, email: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSheetSyncResult(null);

    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);

    if (emailErr || phoneErr) {
      setFieldErrors({ email: emailErr, phone: phoneErr });
      setError('Vui lòng sửa các lỗi nhập liệu màu đỏ bên dưới.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Họ và tên là bắt buộc.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/register-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký không thành công.');
      }

      if (data.sheetSyncStatus) {
        setSheetSyncResult({
          status: data.sheetSyncStatus,
          error: data.sheetError
        });
      }

      onRegister(data.lead);

    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi hệ thống.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chapters = [
    {
      num: "01",
      title: "Giải Mã Tâm Lý Khách Hàng Trên Trang Đích",
      desc: "Cách 3 giây đầu tiên quyết định khách hàng ở lại hay rời đi. Tìm hiểu 'F-Shape' và hành vi cuộn trang."
    },
    {
      num: "02",
      title: "Công Thức Viết Tiêu Đề Thần Thánh (AIDA & PAS)",
      desc: "Viết tiêu đề đánh trúng nỗi đau khách hàng và kích thích hành động tải trang, mua hàng lập tức."
    },
    {
      num: "03",
      title: "Thiết Kế Form Đăng Ký Đạt Tỷ Lệ Chuyển Đổi 30%",
      desc: "Vị trí đặt form, số lượng trường tối ưu, màu sắc nút CTA và kỹ thuật tạo sự khan hiếm tự nhiên."
    },
    {
      num: "04",
      title: "Chiến Lược Tối Ưu Hóa SEO On-Page Cho Landing Page",
      desc: "Cấu trúc thẻ tiêu đề H1-H3, tối ưu tốc độ tải trang, khai báo Schema Markup chuẩn Google."
    },
    {
      num: "05",
      title: "Kịch Bản Đo Lường & Thử Nghiệm A/B Testing",
      desc: "Cách cài đặt Google Analytics, kiểm tra hiệu suất tiêu đề, nút CTA và gia tăng doanh thu liên tục."
    }
  ];

  const handleDownloadOutline = () => {
    const outlineText = `
BẢN ĐỒ CHUYỂN ĐỔI: BÍ QUYẾT TỐI ƯU LANDING PAGE ĐẠT 30% CONVERSION RATE
==================================================================
Giá trị: 79,000 VND - Tải Miễn Phí Tại AI Landing Page Generator

CHƯƠNG 1: GIẢI MÃ TÂM LÝ KHÁCH HÀNG TRÊN TRANG ĐÍCH
- Quy tắc 3 giây đầu tiên thu hút chú ý.
- Áp dụng bản đồ nhiệt (Heatmap) để sắp xếp nội dung.
- Thiết lập luồng trải nghiệm người dùng (UX Flow) mượt mà.

CHƯƠNG 2: CÔNG THỨC VIẾT TIÊU ĐỀ THẦN THÁNH
- Công thức AIDA: Attention -> Interest -> Desire -> Action.
- Công thức PAS: Problem -> Agitate -> Solve.
- 15 mẫu tiêu đề chuyển đổi cao cho mọi ngành nghề.

CHƯƠNG 3: THIẾT KẾ BIỂU MẪU (FORM) ĐĂNG KÝ THÔNG MINH
- Số lượng trường thông tin tối ưu (tối đa 3-4 trường).
- Kỹ thuật giảm ma sát tâm lý (Form Friction).
- Đặt nút CTA hấp dẫn bằng động từ mạnh.

CHƯƠNG 4: HƯỚNG DẪN TỐI ƯU SEO ON-PAGE CHI TIẾT
- Tối ưu Meta Title dưới 60 ký tự, Meta Description dưới 160 ký tự.
- Phân bổ thẻ Heading H1, H2, H3 logic.
- Khai báo JSON-LD Schema tăng hiển thị trên Google.

CHƯƠNG 5: ĐO LƯỜNG VÀ KIỂM THỬ A/B TESTING
- Sử dụng Google Analytics và Microsoft Clarity.
- Cách thiết lập chiến dịch kiểm thử 2 phiên bản.
- Tinh chỉnh nội dung liên tục để bứt phá doanh số.

Chúc bạn xây dựng được những Landing Page triệu đô!
------------------------------------------------------------------
Được cung cấp miễn phí bởi AI Landing Page Generator
    `;
    const blob = new Blob([outlineText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ban-Do-Chuyen-Doi-Ebook-LandingPage-SEO.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="ebook-section" className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden border border-slate-700/60">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      {/* Social Proof Status Bar with pulse effects to boost urgency & trust */}
      <div className="mb-8 bg-slate-950/40 border border-indigo-500/25 rounded-full px-5 py-2.5 flex items-center justify-center gap-2.5 max-w-sm md:max-w-md mx-auto shadow-lg backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs md:text-sm text-slate-200 flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Đang có <strong className="text-emerald-400 font-bold animate-pulse">12 người</strong> cùng xem trang này</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Book mockup and value */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Virtual Book Mockup */}
          <div className="relative group perspective-1000 my-4">
            <div className="w-56 h-80 bg-gradient-to-tr from-indigo-800 via-indigo-600 to-emerald-500 rounded-r-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-12 flex flex-col justify-between p-6 relative border-l-8 border-indigo-900 overflow-hidden">
              {/* Highlight shine */}
              <div className="absolute top-0 left-0 right-0 h-full w-12 bg-white/15 skew-x-12 transform -translate-x-20 group-hover:translate-x-60 transition-transform duration-1000" />
              
              <div className="flex justify-between items-center text-xs tracking-widest text-emerald-300 font-mono">
                <span>EBOOK PREMIUM</span>
                <Bookmark className="w-4 h-4 text-emerald-300 fill-emerald-300" />
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-indigo-200 font-medium tracking-wide uppercase font-mono">4 bước thực hiện</p>
                <h3 className="text-xl md:text-2xl font-bold font-space leading-tight tracking-tight text-white">
                  Ladipage <br/>
                  <span className="text-emerald-300">bằng AI</span>
                </h3>
                <div className="w-12 h-1 bg-emerald-400 rounded-full" />
                <p className="text-[11px] text-indigo-100 leading-snug">
                  Combo 3 công cụ AI hoàn toàn Miễn Phí, bạn sẽ có 1 Ladipage thu hút để chia sẻ đến khách hàng trên ONLINE
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-500/30">
                <div className="text-[10px] text-indigo-200 font-mono leading-none">
                  <p className="font-semibold text-emerald-300">THONGUYENxAI</p>
                  <p className="text-[8px] opacity-75">Người Hướng Dẫn</p>
                </div>
                <div className="bg-white/10 p-1.5 rounded-full">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Price tag badge */}
            <div className="absolute -top-3 -right-3 bg-rose-500 text-white font-black text-xs px-3 py-2 rounded-full shadow-lg rotate-12 flex flex-col items-center border-2 border-white tracking-wide">
              <span>79K cơ bản</span>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-6 flex gap-6 text-center bg-white/5 py-3 px-6 rounded-2xl border border-white/5">
            <div>
              <p className="text-lg font-bold text-emerald-400 font-space">4.9/5</p>
              <p className="text-[10px] text-slate-300">Đánh giá</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-emerald-400 font-space">3,200+</p>
              <p className="text-[10px] text-slate-300">Lượt tải về</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-emerald-400 font-space">30%</p>
              <p className="text-[10px] text-slate-300">Tăng CR Tb</p>
            </div>
          </div>
        </div>

        {/* Right Side: Description and Register Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 rounded-full text-xs font-black w-fit mb-5 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 animate-bounce" />
            <span>Quà tặng độc quyền hôm nay</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <h2 className="text-4xl md:text-6xl font-black font-space tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-400 drop-shadow-sm">
              Nhận Ebook <span className="text-emerald-400 relative inline-block">79K<span className="absolute left-0 bottom-1 w-full h-1 bg-emerald-500/40 rounded" /></span>
            </h2>
            <p className="text-lg md:text-2xl font-black font-space text-indigo-300 tracking-wide leading-tight drop-shadow-md">
              🎯 Tạo Ladipage AI Đầu Tiên Miễn Phí
            </p>
          </div>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
            Giúp bạn sử dụng công cụ tạo 1 Ladipage bằng AI nhanh, thu hút, đúng với nội dung mà khách cần tham khảo cũng như theo dõi. Chỉ trong 15 phút
          </p>

          {/* Benefits bullets */}
          <div className="space-y-2.5 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-200 text-xs md:text-sm">
                <strong>Chiến lược tâm lý:</strong> Cách cấu trúc Landing Page thu hút và giữ chân khách hàng tức thì.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-200 text-xs md:text-sm">
                <strong>SEO tối ưu:</strong> Hướng dẫn thiết lập thẻ Meta, Alt, H1-H3 đạt 100 điểm chuẩn Google.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-200 text-xs md:text-sm">
                <strong>Mở khóa tính năng AI:</strong> Đăng ký giúp mở khóa toàn quyền tải xuống mã nguồn Ladipage AI vừa thiết kế.
              </span>
            </div>
          </div>

          {/* Dynamic Action Area: If registered, show Zalo QR Code confirmation. Else, show registration form. */}
          {registeredLead ? (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 md:p-8 text-center animate-fade-in shadow-2xl space-y-6">
              
              {/* Animated confirmation header */}
              <div className="space-y-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-pulse">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white font-space">
                  🎉 ĐĂNG KÝ THÀNH CÔNG!
                </h4>
                <p className="text-xs md:text-sm text-slate-300">
                  Xin chào <strong className="text-emerald-400">{registeredLead.name}</strong>, vui lòng hoàn thành bước cuối cùng dưới đây để xác nhận và nhận sách.
                </p>

                {/* Google Sheet Sync Feedback Badge */}
                {sheetSyncResult ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl text-[11px] font-medium mx-auto">
                    {sheetSyncResult.status === 'success' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-emerald-400">Đã đồng bộ sang Google Sheet thành công!</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-rose-400 text-left">Đồng bộ Google Sheet thất bại: {sheetSyncResult.error || "Không thể kết nối webhook"}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl text-[11px] font-medium mx-auto text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>Đã lưu đăng ký cục bộ thành công (Chưa cấu hình Google Sheet)</span>
                  </div>
                )}
              </div>

              {/* Zalo Confirmation Block */}
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-6 max-w-md mx-auto space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                  <span>Quét mã xác nhận qua Zalo</span>
                </div>

                {/* QR Code Container with scanning effect */}
                <div className="relative w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  {/* Neon laser scanning line effect */}
                  <div className="absolute left-0 right-0 h-0.5 bg-indigo-500 opacity-75 shadow-[0_0_10px_#6366f1] animate-scan" />
                  
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://zalo.me/0986467014" 
                    alt="Zalo QR 0986467014"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Vui lòng mở ứng dụng <strong className="text-indigo-400">Zalo</strong> và <strong className="text-emerald-400">quét mã QR trên</strong> hoặc kết bạn với số điện thoại <strong className="text-emerald-300">0986467014</strong> (<strong className="text-emerald-300">THONGUYENxAI</strong>) để xác nhận và kích hoạt ngay tài khoản THONGUYENxAI Miễn Phí!
                  </p>
                </div>

                {/* Direct CTA click button */}
                <a
                  href="https://zalo.me/0986467014"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-5 rounded-xl transition-all duration-200 text-xs md:text-sm shadow-lg shadow-indigo-500/20"
                >
                  <span>Mở Chat Zalo Xác Nhận Ngay (0986467014)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Secondary utility actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={handleDownloadOutline}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Ebook</span>
                </button>
                
                <button
                  onClick={() => setIsReading(!isReading)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-xl transition text-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isReading ? "Đóng trình đọc" : "Đọc Ebook Trực Tiếp"}</span>
                </button>
                
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-xl transition text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xem 5 Chương</span>
                </button>
              </div>

              {/* In-app reader placeholder to keep it super interactive */}
              {isReading && (
                <div className="mt-4 p-4 bg-slate-950 border border-slate-800 text-left rounded-xl max-h-60 overflow-y-auto text-xs space-y-3 font-sans">
                  <h5 className="font-bold text-emerald-400 text-sm border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>CHƯƠNG 1: GIẢI MÃ TÂM LÝ KHÁCH HÀNG TRÊN TRANG ĐÍCH</span>
                  </h5>
                  <p className="text-slate-300 leading-relaxed">
                    Khi một người dùng nhấp vào quảng cáo của bạn để truy cập Landing Page, bạn chỉ có vỏn vẹn **3 giây** đầu tiên để thu hút sự chú ý trước khi họ nhấn nút quay lại. Đây được gọi là thời gian vàng quyết định số phận trang đích của bạn.
                  </p>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    Quy tắc thiết kế Hero Section đạt chuyển đổi cao:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li>Tiêu đề (H1) phải chứa đựng lợi ích thiết thực nhất của khách hàng (ví dụ: Tiết kiệm chi phí, Tăng hiệu suất, Xử lý nhanh).</li>
                    <li>Sử dụng hình ảnh trực quan thể hiện sản phẩm/dịch vụ thực tế trong bối cảnh sử dụng.</li>
                    <li>Nút kêu gọi hành động (CTA) nổi bật với màu sắc tương phản cao (Cam, Xanh lá, Đỏ) và lời viết rõ nghĩa.</li>
                  </ul>
                  <p className="text-slate-300 leading-relaxed">
                    Hãy di chuyển xuống khu vực bên dưới để trải nghiệm ngay công cụ **Tạo Landing Page AI** thực chiến!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
              <h4 className="text-sm md:text-base font-bold font-space flex items-center gap-1.5 text-emerald-400 border-b border-slate-800 pb-2">
                <Gift className="w-4 h-4" />
                <span>Form Đăng Ký Nhận Ebook & Tạo Ladipage AI</span>
              </h4>
              
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Địa chỉ Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition ${fieldErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-400'}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-rose-400 text-[10px] mt-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 0912345678"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition ${fieldErrors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-400'}`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-rose-400 text-[10px] mt-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Lĩnh vực kinh doanh của bạn</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Bất động sản, Spa, Mỹ phẩm..."
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý đăng ký...</span>
                  </>
                ) : (
                  <>
                    <span>Nhận Quà Tặng & Mở Khóa Tính Năng AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                * Chúng tôi cam kết bảo mật thông tin tuyệt đối và không gửi thư rác. Nhận quà ngay hôm nay!
              </p>
            </form>
          )}
        </div>

      </div>



      {/* Exclusive Facebook Ads Content Consulting Section */}
      <div className="mt-10 bg-gradient-to-r from-indigo-950/60 to-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            {/* Headline Button / Highlighted Banner Title */}
            <div className="inline-block bg-indigo-600 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-500/20 border border-indigo-400/30 animate-pulse-subtle">
              📢 HỖ TRỢ TƯ VẤN CONTENT LÊN ADS FACEBOOK
            </div>
            
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              Nhận thêm các quà tặng giá trị cao đi kèm giúp chiến dịch quảng cáo của bạn tối ưu chuyển đổi từ Content đến Ladipage:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-center gap-2.5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Tặng phân tích tệp khách hàng đối với sản phẩm</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Tặng 2 mẫu content tối ưu khách INBOX</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Banner gợi ý tạo thiết kế AI</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Hỗ trợ chỉnh Ladipage nâng cao</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-slate-950/60 border border-white/5 rounded-2xl p-5 text-center shrink-0 w-full md:w-52">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">Thời gian có hạn</span>
            <span className="text-2xl font-black text-emerald-400 font-space block">MIỄN PHÍ</span>
            <span className="text-[10px] text-slate-400 line-through block mb-3">Trị giá 1.500.000đ</span>
            <a 
              href={registeredLead ? "https://zalo.me/0986467014" : "#ebook-section"}
              className="w-full py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition text-center shadow-md shadow-emerald-400/10 block"
            >
              Đăng Ký Nhận Ngay
            </a>
          </div>
        </div>
      </div>

      {/* Chapters Expandable Section */}
      {showChapters && (
        <div className="mt-8 border-t border-slate-700/50 pt-8 animate-fade-in">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold font-space">Cấu Trúc Ebook Hướng Dẫn Tối Ưu Tỷ Lệ Chuyển Đổi</h3>
            <p className="text-slate-400 text-xs mt-1">Nội dung đúc kết từ hàng trăm dự án landing page thực chiến</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((ch, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-700/40 p-5 rounded-2xl hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-mono text-sm font-semibold">CHƯƠNG {ch.num}</span>
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="font-bold text-xs md:text-sm text-slate-100 mb-1.5 leading-snug">{ch.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
