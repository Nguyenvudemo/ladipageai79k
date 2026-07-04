import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to prevent crashing if the key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Structured schema for the generated AI Landing Page content
const landingPageSchema = {
  type: Type.OBJECT,
  properties: {
    brandName: {
      type: Type.STRING,
      description: "Tên thương hiệu hoặc tên doanh nghiệp"
    },
    headline: {
      type: Type.STRING,
      description: "Tiêu đề chính cực kỳ hấp dẫn, đánh trúng tâm lý khách hàng"
    },
    subheadline: {
      type: Type.STRING,
      description: "Tiêu đề phụ giải thích rõ hơn về giá trị nhận được"
    },
    ctaText: {
      type: Type.STRING,
      description: "Nút kêu gọi hành động (ví dụ: Đăng ký nhận ưu đãi, Trải nghiệm miễn phí ngay)"
    },
    mainBenefit: {
      type: Type.STRING,
      description: "Mô tả ngắn gọn về lợi ích lớn nhất mà khách hàng nhận được"
    },
    features: {
      type: Type.ARRAY,
      description: "Danh sách 3 đặc điểm nổi bật hoặc lợi ích cốt lõi",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề đặc điểm" },
          description: { type: Type.STRING, description: "Mô tả chi tiết đặc điểm" },
          icon: { 
            type: Type.STRING, 
            description: "Tên icon từ thư viện lucide-react (ví dụ: Sparkles, Zap, Shield, Target, Award, Users, Flame, Heart)" 
          }
        },
        required: ["title", "description", "icon"]
      }
    },
    aboutTitle: {
      type: Type.STRING,
      description: "Tiêu đề phần Giới thiệu/Câu chuyện"
    },
    aboutContent: {
      type: Type.STRING,
      description: "Câu chuyện thương hiệu, uy tín hoặc cam kết chất lượng"
    },
    testimonials: {
      type: Type.ARRAY,
      description: "Danh sách 2 đánh giá của khách hàng thực tế",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Tên khách hàng" },
          role: { type: Type.STRING, description: "Chức vụ hoặc vị trí (ví dụ: Chủ cửa hàng, Nhân viên văn phòng)" },
          feedback: { type: Type.STRING, description: "Nội dung đánh giá chân thực, xúc động" },
          rating: { type: Type.INTEGER, description: "Số sao đánh giá (từ 1 đến 5)" }
        },
        required: ["name", "role", "feedback", "rating"]
      }
    },
    faqs: {
      type: Type.ARRAY,
      description: "Danh sách 3 câu hỏi thường gặp nhất và câu trả lời",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Câu hỏi thường gặp" },
          answer: { type: Type.STRING, description: "Câu trả lời thỏa đáng, thuyết phục" }
        },
        required: ["question", "answer"]
      }
    },
    seo: {
      type: Type.OBJECT,
      properties: {
        metaTitle: { type: Type.STRING, description: "Tiêu đề SEO tối ưu hóa từ khóa chính (dưới 60 ký tự)" },
        metaDescription: { type: Type.STRING, description: "Mô tả SEO hấp dẫn, thu hút người dùng nhấp chuột (dưới 160 ký tự)" },
        keywords: { type: Type.STRING, description: "Các từ khóa chính ngăn cách bằng dấu phẩy" }
      },
      required: ["metaTitle", "metaDescription", "keywords"]
    }
  },
  required: [
    "brandName", 
    "headline", 
    "subheadline", 
    "ctaText", 
    "mainBenefit", 
    "features", 
    "aboutTitle", 
    "aboutContent", 
    "testimonials", 
    "faqs", 
    "seo"
  ]
};

// Fallback high-quality local generator when API Key is missing or on error
function generateMockLandingPage(niche: string, style: string): any {
  const brand = niche.trim() || "Thương Hiệu Của Bạn";
  return {
    brandName: brand,
    headline: `Giải Pháp Kinh Doanh Vượt Trội Cho ${brand} - Tăng Trưởng Khách Hàng Bứt Phá`,
    subheadline: `Sở hữu hệ thống thu hút khách hàng tự động thế hệ mới, tối ưu hóa 300% tỷ lệ chuyển đổi và gia tăng doanh số bền vững.`,
    ctaText: "Nhận Tư Vấn Miễn Phí Ngay",
    mainBenefit: "Chúng tôi giúp bạn tự động hóa quy trình tìm kiếm khách hàng tiềm năng, giảm 50% chi phí quảng cáo và nhân đôi hiệu suất chuyển đổi.",
    features: [
      {
        title: "Tối Ưu Trải Nghiệm Người Dùng",
        description: "Giao diện được thiết kế khoa học, tải trang siêu tốc dưới 1.5 giây giúp khách hàng không bao giờ rời đi.",
        icon: "Zap"
      },
      {
        title: "Form Đăng Ký Thông Minh",
        description: "Tích hợp biểu mẫu tự động nhận diện thông tin, giảm bớt thao tác rườm rà và tăng 40% tỷ lệ hoàn thành form.",
        icon: "Sparkles"
      },
      {
        title: "Bảo Mật & Tin Cậy Tuyệt Đối",
        description: "Hệ thống lưu trữ mã hóa dữ liệu khách hàng an toàn, tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật quốc tế.",
        icon: "Shield"
      }
    ],
    aboutTitle: `Về Chúng Tôi & Sứ Mệnh Đối Với ${brand}`,
    aboutContent: `Với hơn 5 năm kinh nghiệm trong lĩnh vực tối ưu hóa tỷ lệ chuyển đổi (CRO) và xây dựng Landing Page bán hàng chuyên nghiệp, chúng tôi tự hào đã đồng hành cùng hơn 1,200+ doanh nghiệp bứt phá doanh thu. Sứ mệnh của chúng tôi là mang lại những trang đích có thiết kế đỉnh cao, hiệu suất vượt trội và dễ dàng sử dụng cho tất cả mọi người.`,
    testimonials: [
      {
        name: "Anh Hoàng Nam",
        role: "Chủ thương hiệu thời trang Nam&Co",
        feedback: "Từ khi chuyển sang sử dụng landing page mới này, tỷ lệ chuyển đổi khách hàng từ quảng cáo Facebook của tôi tăng từ 4% lên 12%. Chi phí sở hữu một khách hàng tiềm năng giảm hẳn một nửa!",
        rating: 5
      },
      {
        name: "Chị Minh Thư",
        role: "Founder Trung tâm Tiếng Anh Horizon",
        feedback: "Giao diện cực kỳ trực quan, form đăng ký hoạt động rất mượt mà. Đội ngũ hỗ trợ chuyên nghiệp, tận tâm giúp tôi hoàn thiện trang đích chỉ trong 2 ngày làm việc.",
        rating: 5
      }
    ],
    faqs: [
      {
        question: "Hệ thống này có dễ cấu hình và chỉnh sửa không?",
        answer: "Cực kỳ dễ dàng! Bạn hoàn toàn có thể thay đổi màu sắc, nội dung, phông chữ và hình ảnh trực tiếp thông qua bảng tùy chỉnh thông minh mà không cần biết lập trình."
      },
      {
        question: "Dữ liệu đăng ký của khách hàng sẽ được lưu trữ ở đâu?",
        answer: "Dữ liệu đăng ký sẽ được lưu trữ an toàn trong kho dữ liệu đám mây của bạn, đồng thời bạn có thể xuất ra file Excel hoặc tích hợp trực tiếp vào CRM/Gmail chỉ với 1 click."
      },
      {
        question: "Landing page có hỗ trợ tối ưu hiển thị trên điện thoại không?",
        answer: "Có, 100%. Mọi Landing Page được tạo ra đều tự động tối ưu hóa hiển thị (Responsive design) hoàn hảo trên mọi thiết bị: Điện thoại, Máy tính bảng, Laptop và PC."
      }
    ],
    seo: {
      metaTitle: `Giải Pháp Tăng Trưởng Doanh Thu Bứt Phá Cho ${brand}`,
      metaDescription: `Khám phá cách tối ưu hóa Landing Page bán hàng toàn diện giúp ${brand} tăng 300% tỷ lệ chuyển đổi khách hàng và giảm thiểu chi phí quảng cáo.`,
      keywords: `landing page ${brand}, tối ưu landing page, tăng chuyển đổi, ebook marketing, landing page ai`
    }
  };
}

// API Endpoint to generate a customized Landing Page using Gemini
app.post("/api/generate-ladipage", async (req, res) => {
  try {
    const { niche, style, language = "Vietnamese" } = req.body;
    if (!niche) {
      return res.status(400).json({ error: "Lĩnh vực kinh doanh (niche) là bắt buộc." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.log("No valid Gemini API key found, generating customized mock data.");
      const mockData = generateMockLandingPage(niche, style);
      return res.json({ source: "local_mock", data: mockData });
    }

    const prompt = `Bạn là một chuyên gia thiết kế Landing Page (Ladipage) có tỷ lệ chuyển đổi cao và tối ưu SEO hàng đầu Việt Nam.
Hãy thiết kế nội dung chi tiết cho một Landing Page thuộc lĩnh vực kinh doanh: "${niche}".
Phong cách thiết kế yêu cầu: "${style}" (ví dụ: Công nghệ hiện đại, Tối giản tinh tế, Thân thiện ấm cúng, Độc đáo phá cách).
Mọi nội dung phải viết bằng tiếng Việt tự nhiên, thuyết phục, đánh trúng nỗi đau khách hàng, nêu bật giải pháp và lợi ích vượt trội.
Vui lòng sử dụng cấu trúc schema đã định nghĩa để trả về kết quả JSON chính xác.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Bạn là một AI chuyên viết nội dung landing page (copywriter) chuyên nghiệp bằng tiếng Việt.",
        responseMimeType: "application/json",
        responseSchema: landingPageSchema,
        temperature: 0.85
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Không nhận được dữ liệu phản hồi từ AI.");
    }

    const parsedData = JSON.parse(text.trim());
    return res.json({ source: "gemini_api", data: parsedData });

  } catch (error: any) {
    console.error("Error generating landing page with Gemini:", error);
    // Return high-quality mock data on error so user session remains uninterrupted
    const fallbackData = generateMockLandingPage(req.body.niche || "Mặc định", req.body.style || "Hiện đại");
    return res.json({ 
      source: "error_fallback", 
      message: error.message || "Lỗi kết nối AI, hiển thị dữ liệu mẫu tối ưu.",
      data: fallbackData 
    });
  }
});

// API Endpoint for generating custom SEO guidance or auditing SEO meta tags
app.post("/api/optimize-seo", async (req, res) => {
  try {
    const { title, description, keywords, brandName, niche } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const mockSeoAnalysis = {
        score: 85,
        analysis: [
          "Tiêu đề của bạn chứa từ khóa chính và có độ dài tối ưu (khoảng 50-60 ký tự).",
          "Thẻ mô tả đã bao gồm lời kêu gọi hành động (CTA) thu hút người dùng nhấp chuột.",
          "Các từ khóa chính đã được phân bố tự nhiên trong nội dung mẫu."
        ],
        recommendations: [
          "Hãy chắc chắn đặt từ khóa quan trọng nhất ở ngay đầu thẻ tiêu đề (H1 và Meta Title).",
          "Tối ưu dung lượng hình ảnh dưới 100KB và thêm thuộc tính alt chứa từ khóa.",
          "Xây dựng liên kết nội bộ giữa Landing Page và trang chủ hoặc các bài viết liên quan."
        ]
      };
      return res.json({ source: "local_mock", data: mockSeoAnalysis });
    }

    const prompt = `Phân tích và tối ưu hóa SEO cho Landing Page:
Tên doanh nghiệp: "${brandName}"
Lĩnh vực: "${niche}"
Tiêu đề hiện tại: "${title}"
Mô tả hiện tại: "${description}"
Từ khóa hiện tại: "${keywords}"

Hãy phân tích bộ thẻ SEO trên và đề xuất cải tiến tối ưu. Trả về một đối tượng JSON có các trường:
1. score: Điểm SEO đánh giá (số từ 0 đến 100)
2. analysis: Danh sách các điểm tốt và điểm cần khắc phục của thẻ SEO hiện tại (mảng chuỗi)
3. recommendations: Danh sách các đề xuất hành động cụ thể để đạt vị trí cao trên Google Search (mảng chuỗi)

Hãy viết câu trả lời bằng tiếng Việt chuyên sâu và dễ hiểu.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            analysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "analysis", "recommendations"]
        }
      }
    });

    const parsedSeo = JSON.parse(response.text?.trim() || "{}");
    return res.json({ source: "gemini_api", data: parsedSeo });

  } catch (error: any) {
    console.error("Error optimizing SEO with Gemini:", error);
    return res.json({
      source: "error_fallback",
      data: {
        score: 75,
        analysis: ["Đang hiển thị phân tích SEO chuẩn hóa do gặp sự cố kết nối AI."],
        recommendations: [
          "Đặt từ khóa cốt lõi trong thẻ H1 và đoạn văn đầu tiên.",
          "Giữ thẻ mô tả meta ngắn gọn dưới 155 ký tự và chứa từ khóa.",
          "Tối ưu hóa hình ảnh với thuộc tính alt mô tả rõ ràng."
        ]
      }
    });
  }
});

// Memory store for registered leads (simple server list)
const leadsList: any[] = [];

// API Endpoint to register a lead and synchronize with Google Sheet
app.post("/api/register-lead", async (req, res) => {
  try {
    const { name, email, phone, niche, webhookUrl } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ các thông tin bắt buộc." });
    }

    // 1. Validate Phone Number (Starts with 0, only digits, exactly 10 characters)
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\d+$/.test(cleanPhone)) {
      return res.status(400).json({ error: "Số điện thoại chỉ được chứa ký tự số." });
    }
    if (!cleanPhone.startsWith('0')) {
      return res.status(400).json({ error: "Số điện thoại phải bắt đầu bằng số 0." });
    }
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ error: `Số điện thoại phải có đúng 10 số (hiện tại: ${cleanPhone.length} số).` });
    }

    // 2. Validate Gmail format
    const cleanEmail = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Vui lòng nhập đúng định dạng Gmail (...@gmail.com)." });
    }

    // 3. Format phone number with leading single quote so Google Sheets treats it as text and preserves the leading zero
    const sheetPhone = `'${cleanPhone}`;

    const newLead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone, // raw phone
      sheetPhone: sheetPhone, // with leading zero fixer for Google Sheets
      niche: niche?.trim() || "Nhận Quà Ebook",
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    leadsList.push(newLead);

    // Google Sheet webhook integration
    const actualWebhook = webhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSyncStatus = "not_configured";
    let sheetError = null;

    if (actualWebhook && actualWebhook.startsWith("http")) {
      try {
        const payload = {
          id: newLead.id,
          name: newLead.name,
          email: newLead.email,
          phone: sheetPhone, // Prepend with single quote for sheet import to fix '0' dropping!
          niche: newLead.niche,
          createdAt: newLead.createdAt
        };

        const response = await fetch(actualWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          sheetSyncStatus = "success";
        } else {
          sheetSyncStatus = "failed";
          sheetError = `HTTP Status: ${response.status}`;
        }
      } catch (err: any) {
        console.error("Sync to Google Sheets failed:", err);
        sheetSyncStatus = "error";
        sheetError = err.message || "Lỗi kết nối mạng";
      }
    }

    return res.json({
      success: true,
      lead: newLead,
      sheetSyncStatus,
      sheetError
    });

  } catch (error: any) {
    console.error("Error in register-lead API:", error);
    return res.status(500).json({ error: error.message || "Lỗi hệ thống khi đăng ký." });
  }
});

// API Endpoint to fetch registered leads
app.get("/api/leads", (req, res) => {
  res.json(leadsList);
});

// Configure Vite or serve production build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
