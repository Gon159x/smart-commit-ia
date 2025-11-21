export async function fetchModelsFromOpenRouter(apiKey, topN = 10) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Error al obtener modelos: ${res.status}`);
    }

    const rawModels = (await res.json()).data;

    const allModels = rawModels
      .filter((m) => m.pricing?.prompt != null)
      .map((m) => ({
        name: m.id,
        price: formatPrice(m.pricing),
        maxTokens: m.context_length,
        cost: parsePrice(m.pricing),
      }))
      .sort((a, b) => a.cost - b.cost);

    const alwaysInclude = [
      "openai/gpt-5-nano",
      "openai/gpt-4.1-nano",
      "openai/gpt-4.1",
      "openai/gpt-3.5-turbo",
      "openai/gpt-4",
    ];

    const mustHaveModels = allModels.filter((m) => alwaysInclude.includes(m.name));

    const cheapestModels = allModels.slice(0, topN);

    const merged = [...mustHaveModels, ...cheapestModels];
    const uniqueModels = merged.filter(
      (m, i, arr) => arr.findIndex((x) => x.name === m.name) === i
    );

    return uniqueModels.map(({ cost, ...rest }) => rest);
  } catch (err) {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function formatPrice(pricing) {
  const input = parseFloat(pricing.prompt || 0) * 1_000_000;
  const output = parseFloat(pricing.completion || 0) * 1_000_000;

  return `$${input.toFixed(2)} / 1M input${
    output ? ` + $${output.toFixed(2)} / 1M output` : ""
  }`;
}

function parsePrice(pricing) {
  const input = parseFloat(pricing.prompt || 0);
  const output = parseFloat(pricing.completion || 0);
  return input + output;
}
