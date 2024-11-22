import { GoogleGenerativeAI } from "@google/generative-ai";

export const processFileWithGemini = async (file) => {
  try {
    const base64Data = await fileToBase64(file);
    
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this ${file.type.includes('pdf') ? 'PDF document' : 'image'} and extract the following information into three distinct sections:

1. Invoices section with exactly these fields:
   - Serial Number
   - Customer Name
   - Product Name
   - Quantity
   - Tax
   - Total Amount
   - Date

2. Products section with exactly these fields:
   - Name
   - Quantity
   - Unit Price
   - Tax
   - Price with Tax
   - Discount (optional)

3. Customers section with exactly these fields:
   - Customer Name
   - Phone Number
   - Total Purchase Amount

Return ONLY a JSON object with these three sections: "invoices", "products", and "customers".
Format numbers as plain numbers without currency symbols.
Do not include any explanatory text or markdown formatting.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing file with Gemini:", error);
    throw error;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}; 