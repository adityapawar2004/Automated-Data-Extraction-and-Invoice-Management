import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from 'xlsx';

export const processFileWithGemini = async (file) => {
  try {
    if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.type.includes('csv')) {
      return await processSpreadsheetFile(file);
    } else {
      return await processImageOrPDF(file);
    }
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

const processSpreadsheetFile = async (file) => {
  try {
    const data = await readSpreadsheetData(file);
    // Convert the data to the expected format
    const formattedData = {
      invoices: extractInvoices(data),
      products: extractProducts(data),
      customers: extractCustomers(data)
    };
    return JSON.stringify(formattedData);
  } catch (error) {
    console.error("Error processing spreadsheet:", error);
    throw error;
  }
};

const readSpreadsheetData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const extractInvoices = (data) => {
  return data.map((row, index) => ({
    id: `invoice-${Date.now()}-${index}`,
    serialNumber: row['Serial Number'] || row['Invoice Number'] || row['serialNumber'] || '',
    customerName: row['Customer Name'] || row['customerName'] || '',
    productName: row['Product Name'] || row['productName'] || '',
    quantity: Number(row['Quantity'] || row['quantity'] || 0),
    tax: Number(row['Tax'] || row['tax'] || 0),
    totalAmount: Number(row['Total Amount'] || row['totalAmount'] || 0),
    date: row['Date'] || row['date'] || new Date().toISOString().split('T')[0]
  }));
};

const extractProducts = (data) => {
  return data.map((row, index) => ({
    id: `product-${Date.now()}-${index}`,
    name: row['Product Name'] || row['productName'] || '',
    quantity: Number(row['Quantity'] || row['quantity'] || 0),
    unitPrice: Number(row['Unit Price'] || row['unitPrice'] || 0),
    tax: Number(row['Tax'] || row['tax'] || 0),
    priceWithTax: Number(row['Price with Tax'] || row['priceWithTax'] || 0),
    discount: Number(row['Discount'] || row['discount'] || 0)
  }));
};

const extractCustomers = (data) => {
  // Create a map to aggregate customer data
  const customerMap = new Map();

  data.forEach(row => {
    const customerName = row['Customer Name'] || row['customerName'] || '';
    const phoneNumber = row['Phone Number'] || row['phoneNumber'] || '';
    const amount = Number(row['Total Amount'] || row['totalAmount'] || 0);

    if (customerName) {
      if (!customerMap.has(customerName)) {
        customerMap.set(customerName, {
          id: `customer-${Date.now()}-${customerName}`,
          customerName,
          phoneNumber,
          totalPurchaseAmount: amount
        });
      } else {
        const customer = customerMap.get(customerName);
        customer.totalPurchaseAmount += amount;
      }
    }
  });

  return Array.from(customerMap.values());
};

const processImageOrPDF = async (file) => {
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