import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI server-side client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback categorization rule engine
function ruleCategorize(description: string): { category: string; reason: string } {
  const desc = description.toLowerCase();
  if (/lunch|dinner|breakfast|food|restaurant|cafe|swiggy|zomato|starbucks|burger|pizza|coffee|groceries|supermarket|bakery|snacks|meal/.test(desc)) {
    return { category: 'Food', reason: 'Identified dining or grocery keyword' };
  }
  if (/uber|ola|cab|taxi|metro|train|bus|fuel|petrol|diesel|flight|parking|toll|transit|transport/.test(desc)) {
    return { category: 'Transport', reason: 'Identified commuting or travel keyword' };
  }
  if (/tuition|course|book|udemy|coursera|college|school|exam|stationery|class|education|training/.test(desc)) {
    return { category: 'Education', reason: 'Identified academic or course material keyword' };
  }
  if (/amazon|flipkart|clothing|shoes|zara|h&m|electronics|gadget|shopping|mall|store/.test(desc)) {
    return { category: 'Shopping', reason: 'Identified retail purchase or shopping keyword' };
  }
  if (/netflix|spotify|prime|movie|cinema|game|steam|playstation|concert|theatre|entertainment/.test(desc)) {
    return { category: 'Entertainment', reason: 'Identified media, streaming, or recreational activity' };
  }
  if (/rent|electricity|water|wifi|broadband|mobile|recharge|utility|maintenance|gas|bill/.test(desc)) {
    return { category: 'Bills', reason: 'Identified recurring utility or bill payment' };
  }
  if (/doctor|medicine|pharmacy|hospital|clinic|dental|health|gym|fitness|insurance/.test(desc)) {
    return { category: 'Healthcare', reason: 'Identified medical, fitness, or healthcare expense' };
  }
  return { category: 'Other', reason: 'General expense category' };
}

// AI Smart Categorization Route
app.post('/api/ai/categorize', async (req: Request, res: Response) => {
  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required' });
  }

  // Fast rule check fallback
  const fallback = ruleCategorize(description);

  if (!ai || !apiKey) {
    return res.json({ category: fallback.category, reason: fallback.reason, source: 'heuristic' });
  }

  try {
    const prompt = `You are a financial transaction categorizer for PocketSmart AI.
Categories available: ["Food", "Transport", "Education", "Shopping", "Entertainment", "Bills", "Healthcare", "Other"].
Transaction description: "${description}"

Respond ONLY with a JSON object in this exact format:
{
  "category": "<one of the valid categories>",
  "reason": "<short 4-8 word explanation>"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json({
      category: parsed.category || fallback.category,
      reason: parsed.reason || fallback.reason,
      source: 'gemini',
    });
  } catch (err) {
    console.error('Categorization error:', err);
    return res.json({ category: fallback.category, reason: fallback.reason, source: 'fallback' });
  }
});

// AI Recommendations Route
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  const { summary } = req.body;
  if (!summary) {
    return res.status(400).json({ error: 'Financial summary is required' });
  }

  // Default deterministic rules if no API key or on error
  const fallbackRecommendations = [
    {
      id: 'rec-1',
      title: 'Review Food & Dining Spending',
      category: 'Food',
      type: 'tip',
      reason: 'Food & dining represents a significant share of your variable expenses this month.',
      action: 'Check recent food orders and plan meal prep.',
    },
    {
      id: 'rec-2',
      title: 'Audit Recurring Subscriptions',
      category: 'Entertainment',
      type: 'warning',
      reason: 'Multiple digital streaming and recurring services were detected.',
      action: 'Check active subscriptions to see if any are rarely used.',
    },
    {
      id: 'rec-3',
      title: 'Savings Pace on Track',
      category: 'Savings',
      type: 'praise',
      reason: 'Your remaining balance shows positive net cash flow this cycle.',
      action: 'Consider allocating a portion to your high-priority goal.',
    },
  ];

  if (!ai || !apiKey) {
    return res.json({ recommendations: fallbackRecommendations, source: 'rules' });
  }

  try {
    const prompt = `You are PocketSmart Intelligence, an AI budgeting recommendation engine.
Analyze this user's financial summary:
- Currency: ${summary.currency || 'INR'}
- Total Monthly Income: ${summary.totalIncome}
- Total Monthly Expenses: ${summary.totalExpenses}
- Net Remaining: ${summary.remainingBudget}
- Category Expenses: ${JSON.stringify(summary.categoryTotals || {})}
- Budgets: ${JSON.stringify(summary.budgets || {})}
- Goals: ${JSON.stringify(summary.goals || [])}
- Recurring Subscriptions: ${JSON.stringify(summary.recurring || [])}

Rules:
1. Provide 3 to 4 actionable, empathetic recommendations.
2. Clearly explain the *reason* based on user's actual numbers.
3. Use simple, non-judgmental language.
4. Do NOT give investment or stock advice. Do NOT guarantee returns.
5. Format response ONLY as a JSON array with objects matching:
[
  {
    "id": "rec-1",
    "title": "Short title",
    "category": "Category name or General",
    "type": "tip" | "warning" | "praise" | "saving",
    "reason": "Clear explanation based on actual spending",
    "action": "Concrete next step to take"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json({ recommendations: parsed, source: 'gemini' });
  } catch (err) {
    console.error('Recommendations error:', err);
    return res.json({ recommendations: fallbackRecommendations, source: 'fallback' });
  }
});

// AI Assistant Conversational Chat Route
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const { message, financialContext } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const currency = financialContext?.currency || '₹';
  const income = financialContext?.totalIncome || 0;
  const expenses = financialContext?.totalExpenses || 0;
  const remaining = financialContext?.remainingBudget || (income - expenses);
  const categories = financialContext?.categoryTotals || {};
  const largestCategory = Object.entries(categories).sort((a: any, b: any) => b[1] - a[1])[0] || ['None', 0];

  // Fallback intelligent answer logic
  const lower = message.toLowerCase();
  let fallbackReply = `Here is a quick look at your current numbers: You have earned ${currency}${income.toLocaleString()} and spent ${currency}${expenses.toLocaleString()} this month, leaving ${currency}${remaining.toLocaleString()} remaining.`;

  if (lower.includes('food')) {
    const foodSpend = categories['Food'] || 0;
    fallbackReply = `You have spent ${currency}${foodSpend.toLocaleString()} on Food & Dining this month so far.`;
  } else if (lower.includes('most') || lower.includes('biggest') || lower.includes('largest')) {
    fallbackReply = `Your highest expense category is ${largestCategory[0]} at ${currency}${Number(largestCategory[1]).toLocaleString()}.`;
  } else if (lower.includes('budget') || lower.includes('remaining') || lower.includes('left')) {
    fallbackReply = `You have ${currency}${remaining.toLocaleString()} remaining in your budget for this month.`;
  } else if (lower.includes('save') || lower.includes('saving')) {
    const savings = Math.max(0, income - expenses);
    fallbackReply = `Your current net savings for this period is ${currency}${savings.toLocaleString()} (${income > 0 ? Math.round((savings / income) * 100) : 0}% of your income).`;
  } else if (lower.includes('goal')) {
    const goalsCount = financialContext?.goals?.length || 0;
    fallbackReply = `You currently have ${goalsCount} active financial goals being tracked in PocketSmart AI. Keep up the consistent contributions!`;
  }

  if (!ai || !apiKey) {
    return res.json({ reply: fallbackReply, source: 'rule-engine' });
  }

  try {
    const systemInstruction = `You are "PocketSmart Assistant", a friendly, knowledgeable personal financial companion.
You answer questions directly using the user's stored budget and spending data:
- Currency: ${currency}
- Total Income: ${currency}${income}
- Total Expenses: ${currency}${expenses}
- Remaining Budget: ${currency}${remaining}
- Spending by Category: ${JSON.stringify(categories)}
- Active Budgets: ${JSON.stringify(financialContext?.budgets || {})}
- Financial Goals: ${JSON.stringify(financialContext?.goals || [])}
- Recurring Subscriptions: ${JSON.stringify(financialContext?.recurring || [])}

Rules:
1. Always base answers on the actual stored numbers provided.
2. Keep responses concise, clear, and encouraging (2-4 sentences).
3. Do NOT provide investment advice, stock trading tips, or guarantees.
4. If asked about something not in the data, state politely that there is no recorded transaction for that yet.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text?.trim() || fallbackReply;
    return res.json({ reply, source: 'gemini' });
  } catch (err) {
    console.error('Chat error:', err);
    return res.json({ reply: fallbackReply, source: 'fallback' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`PocketSmart AI server running on port ${port}`);
  });
}

startServer();
