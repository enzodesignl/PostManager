export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { tema, nicho, objetivo } = req.body;

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: `
Crie um carrossel visual para Instagram.

Tema: ${tema}
Nicho: ${nicho}
Objetivo: ${objetivo}

Retorne apenas JSON válido neste formato:

{
  "slides": [
    {
      "titulo": "...",
      "texto": "...",
      "direcaoVisual": "..."
    }
  ],
  "legenda": "...",
  "cta": "..."
}

Crie 4 slides.
Textos curtos.
Linguagem profissional.
Cores sugeridas: branco, preto e laranja.
`
          }
        ]
      })
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      return res.status(500).json({
        erro: data.error?.message || "Erro na OpenAI"
      });
    }

    const texto = data.choices[0].message.content;

    return res.status(200).json({
      resultado: texto
    });

  } catch (erro) {
    return res.status(500).json({
      erro: erro.message
    });
  }
}
