export async function searchFoodWithGemini(query: string, apiKey: string) {
  const prompt = `
  You are an expert nutritionist database. 
  The user searched for: "${query}".
  Please estimate the nutritional information for a standard serving of this food. Focus on foods from Malaysia, Bangladesh, and India if the name is ambiguous.
  
  Return ONLY a raw JSON object (no markdown formatting, no code blocks) with exactly these fields:
  {
    "name": "string (the canonical name of the food)",
    "serving_size": "string (e.g. '1 plate', '100g', '1 cup')",
    "grams": number (estimated weight in grams),
    "calories": number (estimated calories),
    "protein": number (estimated protein in grams),
    "carbs": number (estimated carbohydrates in grams),
    "fat": number (estimated fat in grams),
    "region": "string (the region this food belongs to, e.g. 'Malaysia')",
    "confidence_score": number (a float between 0.0 and 1.0 representing how confident you are in this estimate)
  }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2, // low temperature for more factual responses
          },
        }),
      }
    );

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      let resultText = data.candidates[0].content.parts[0].text;
      
      // Clean up markdown code blocks if the model ignored the instruction
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedNutrition = JSON.parse(resultText);
      return parsedNutrition;
    } else {
      throw new Error("No candidates returned from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
