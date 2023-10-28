import { initialPrompt } from './../../app/components/InitialPrompt';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // ***注意*** クライアントサイドの実行を許可
});
export async function ask(content: string, history: Array<{ prompt: string, response: string }>) {
    // 履歴からシステムプロンプトを構築
    const historyText = history.map((entry, index) => 
      `質問 ${index + 1}: ${entry.prompt}\n回答 ${index + 1}: ${entry.response}`
    ).join('\n');
  
    const systemPrompt = `${initialPrompt}\n\n${historyText}`;
  
    // メッセージを送信
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },  // 更新されたシステムプロンプト
        { role: 'user', content: content },
      ],
      model: "gpt-3.5-turbo",
    });
  
    // 回答結果を返却
    console.log(completion);
    const answer = completion.choices[0].message?.content;
    return answer;
  }