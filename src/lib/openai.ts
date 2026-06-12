import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateMessage(name: string, nickname: string): Promise<string> {
  const prompt = `你是一位即将毕业的学生，正在为你的同学${name}（昵称：${nickname}）写毕业留言。请写一段温暖、真诚、充满回忆的毕业留言，字数在100-200字之间。要体现青春、友谊和对未来的祝福。`

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: '你是一个温暖真诚的毕业生，正在为同学写毕业留言。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 300,
    temperature: 0.8,
  })

  return response.choices[0]?.message?.content || '愿友谊长存，前程似锦！'
}
