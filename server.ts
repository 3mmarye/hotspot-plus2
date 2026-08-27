import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy or safe Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health API
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "HOTSPOT PLUS",
      developer: "Ammar Ahmed (عمار أحمد)",
      phone: "782727242",
      bundleId: "com.hotspotplus.app",
    });
  });

  // Gemini AI Assistant for MikroTik Hotspot
  app.post("/api/gemini/assist", async (req, res) => {
    try {
      const { prompt, currentHtml, currentCss, currentJs, networkName, phone, colors } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "الرجاء إدخال تفاصيل التعديل المطلوب." });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback intelligent heuristic processor when API key is not yet set
        return res.json({
          success: true,
          modelUsed: "local-rule-engine",
          suggestedChanges: generateHeuristicChanges(prompt, { networkName, phone, colors, currentHtml, currentCss }),
          explanation: "تم تنفيذ التعديل الذكي عبر المحرك المحلي لحماية متغيرات MikroTik.",
        });
      }

      const systemInstruction = `
You are the AI Assistant for "HOTSPOT PLUS" (هوت سبوت بلس), an iOS app developed by Ammar Ahmed (عمار أحمد - 782727242) for editing MikroTik Hotspot login pages.

CRITICAL RULES:
1. STRICTLY PRESERVE all MikroTik variables such as $(username), $(password), $(link-login), $(link-orig), $(error), $(ip), $(mac), $(identity), $(chap-id), $(chap-challenge), $(popup), $(trial), $(domain), $(interface-name), $(link-login-only), $(link-logout), $(link-status). NEVER remove or alter these variables.
2. Form action must remain $(link-login-only) or $(link-login) or existing MikroTik form structure.
3. Keep user input fields for username and password with name="username" and name="password".
4. Output changes clearly in structured JSON containing:
   - "summary": Short Arabic summary of modifications.
   - "networkName": Updated network name if requested (or retain existing).
   - "phone": Updated phone/WhatsApp if requested (or retain existing).
   - "primaryColor": Updated primary hex color if requested.
   - "secondaryColor": Updated secondary hex color if requested.
   - "bgColor": Updated background color or gradient if requested.
   - "buttonShape": "pill" | "rounded" | "square" | "sharp" if requested.
   - "newHtml": Modified HTML string with changes applied while keeping MikroTik tags intact.
   - "newCss": Modified CSS string if custom CSS rules were improved.
   - "newJs": Modified JS string if needed.
   - "mikrotikVariablesPreserved": array of discovered and preserved variables.
`;

      const userContent = `
User Prompt in Arabic: "${prompt}"

Current Project Data:
- Network Name: ${networkName || "غير محدد"}
- Phone/WhatsApp: ${phone || "782727242"}
- Current Colors: Primary: ${colors?.primary || "#3b82f6"}, Bg: ${colors?.bg || "#0f172a"}

Current HTML snippet:
${currentHtml?.slice(0, 3000) || "<!-- Default Hotspot Page -->"}

Current CSS snippet:
${currentCss?.slice(0, 2000) || "/* CSS */"}

Please respond ONLY with a valid JSON object matching the requested schema. Do not wrap in markdown quotes if possible, or return raw JSON.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userContent,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch {
        const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(clean);
      }

      return res.json({
        success: true,
        modelUsed: "gemini-3.7-flash",
        suggestedChanges: parsedData,
        explanation: parsedData.summary || "تم تحليل وتطبيق التعديل بواسطة Gemini الذكي بنجاح.",
      });
    } catch (err: any) {
      console.error("Gemini assist error:", err);
      return res.status(500).json({
        error: "فشل استدعاء مساعد الذكاء الاصطناعي: " + (err.message || "خطأ غير متوقع"),
      });
    }
  });

  // Helper local heuristic engine
  function generateHeuristicChanges(
    prompt: string,
    context: { networkName?: string; phone?: string; colors?: any; currentHtml?: string; currentCss?: string }
  ) {
    let newNetName = context.networkName || "شبكة النور";
    let newPhone = context.phone || "782727242";
    let newPrimary = context.colors?.primary || "#2563eb";
    let newBg = context.colors?.bg || "#0f172a";
    let buttonShape = "rounded";

    const p = prompt.toLowerCase();

    // Network name matching
    const nameMatch = prompt.match(/(?:اسم الشبكة إلى|شبكة|اسمها)\s*[:：]?\s*([^\n,،.]+)/i);
    if (nameMatch && nameMatch[1]) {
      newNetName = nameMatch[1].trim();
    }

    // Phone matching
    const phoneMatch = prompt.match(/(?:رقم|هاتف|واتساب|واتس)\s*[:：]?\s*(\d{7,15})/i);
    if (phoneMatch && phoneMatch[1]) {
      newPhone = phoneMatch[1].trim();
    }

    // Color matching
    if (p.includes("كحلي") || p.includes("أزرق داكن") || p.includes("navy")) {
      newPrimary = "#1e3a8a";
      newBg = "#0b1120";
    } else if (p.includes("أخضر") || p.includes("green") || p.includes("زمردي")) {
      newPrimary = "#059669";
      newBg = "#064e3b";
    } else if (p.includes("أحمر") || p.includes("red") || p.includes("قرمزي")) {
      newPrimary = "#dc2626";
      newBg = "#450a0a";
    } else if (p.includes("بنفسجي") || p.includes("purple") || p.includes("أرجواني")) {
      newPrimary = "#7c3aed";
      newBg = "#2e1065";
    } else if (p.includes("ذهبي") || p.includes("أصفر") || p.includes("gold")) {
      newPrimary = "#d97706";
      newBg = "#1c1917";
    } else if (p.includes("داكن") || p.includes("ليلي") || p.includes("dark") || p.includes("أسود")) {
      newBg = "#090d16";
    } else if (p.includes("فاتح") || p.includes("أبيض") || p.includes("light")) {
      newBg = "#f8fafc";
    }

    if (p.includes("دائرية") || p.includes("كبسولة") || p.includes("pill")) {
      buttonShape = "pill";
    } else if (p.includes("مربعة") || p.includes("square")) {
      buttonShape = "square";
    }

    return {
      summary: `تم تطبيق تعديلات: ${prompt}`,
      networkName: newNetName,
      phone: newPhone,
      primaryColor: newPrimary,
      bgColor: newBg,
      buttonShape,
      mikrotikVariablesPreserved: ["$(link-login-only)", "$(username)", "$(password)", "$(error)", "$(mac)", "$(ip)"],
    };
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HOTSPOT PLUS server running on port ${PORT}`);
  });
}

startServer();
