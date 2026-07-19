# PROMPTS.md — AI Prompt Engineering Log
## GuestVoice | Aryan Butola | TBI-26101147 | Week 7

---

## Feature: Guest Review Analyser
**Model used:** Google Gemini `gemini-1.5-flash`  
**Endpoint:** `POST /api/ai/analyze`  
**Task:** Analyse a guest review and return structured sentiment, themes, a summary, a suggested management response, and improvement suggestions.

---

## Prompt Variation 1 — Simple Direct (❌ Worst)

### Prompt
```
Analyse this guest review: "{review_text}"
Return the sentiment, key themes, and a suggested response.
```

### Example Input
```
Review: "The room was clean but the WiFi was very slow and the food was average."
```

### Example Output
```
The sentiment of this review is mixed/neutral. The guest appreciated the cleanliness but was dissatisfied with the WiFi speed and found the food average. Here is a suggested response:

Dear Guest, thank you for your feedback! We're glad you found the room clean. We apologize for the WiFi issues and will work on improving our food offerings. We hope to welcome you back soon!
```

### Why It Failed
- Returned **plain text** instead of structured JSON — impossible to parse programmatically
- No confidence score, no theme list, no structured fields
- The "sentiment" description was vague ("mixed/neutral") instead of a clean label
- Could not be consumed by the frontend to render separate UI components

---

## Prompt Variation 2 — Role + Numbered List (⚠️ Better, but inconsistent)

### Prompt
```
You are a hospitality manager AI. Analyse this guest review and provide:
1. Sentiment (positive, neutral, or negative)
2. Key themes mentioned (comma-separated)
3. A professional management response (2-3 sentences)

Guest: {guest_name}
Property: {property}
Rating: {rating}/5
Review: "{review_text}"

Format your response as:
Sentiment: ...
Themes: ...
Response: ...
```

### Example Input
```
Guest: Priya Sharma
Property: Hilltop Haven
Rating: 3/5
Review: "Location was great, very peaceful. But the bathroom could be cleaner and there were no basic toiletries provided."
```

### Example Output
```
Sentiment: neutral
Themes: location, cleanliness, amenities
Response: Dear Priya, thank you for your review and for choosing Hilltop Haven! We're thrilled you enjoyed our peaceful location. We sincerely apologize for the bathroom hygiene issues and missing toiletries — we have addressed this with our housekeeping team and will ensure all rooms are stocked with essential amenities. We hope to have you back for a much improved stay!
```

### Why It Was Better (but still not ideal)
- Consistent sentiment labels ✅
- Themes as a list ✅
- But output was **plain text with labels**, not JSON — still needed fragile regex parsing
- No confidence score, no summary, no improvement suggestions
- Inconsistent formatting between calls (sometimes returned extra explanation text)

---

## Prompt Variation 3 — Structured JSON + System Persona (✅ Best — Used in Production)

### Prompt
```
You are an expert hospitality analytics AI for GuestVoice, a platform that helps homestay 
property owners understand and respond to guest reviews professionally.

Analyse the following guest review and return ONLY a valid JSON object with exactly these fields:
- "ai_sentiment": one of "positive", "neutral", or "negative"
- "confidence": integer 0-100 representing how confident you are in the sentiment
- "ai_themes": array of strings from this list only: ["cleanliness", "location", "hospitality", "food", "value", "connectivity", "comfort", "amenities", "general"]
- "summary": one clear sentence summarising the guest experience
- "management_response": a professional, warm, personalised 2-3 sentence reply the property owner can send to the guest. Address them by first name.
- "improvement_suggestions": array of 1-3 specific, actionable improvements (empty array [] if the review is fully positive with rating 5)

Guest Review Details:
- Guest Name: {guest_name}
- Property: {property}
- Rating: {rating}/5 stars
- Review: "{review_text}"

Rules:
- Return ONLY the JSON object. No markdown, no code blocks, no explanation.
- Be empathetic and professional in the management_response.
- Base sentiment strictly on the review text, not just the rating.
- Keep improvement_suggestions concise and specific.
```

### Example Input
```
Guest Name: Rahul Mehta
Property: Mountain Breeze Cottage
Rating: 4/5
Review: "Beautiful views and very friendly host. The bedroom was comfortable and cozy. 
          Only issue was the water heater was a bit slow in the morning."
```

### Example Output
```json
{
  "ai_sentiment": "positive",
  "confidence": 88,
  "ai_themes": ["hospitality", "comfort", "amenities"],
  "summary": "Rahul had a very positive stay appreciating the views, host warmth, and room comfort, with a minor concern about the water heater.",
  "management_response": "Thank you so much for your kind words, Rahul! We're delighted you enjoyed the mountain views and felt welcomed by our team. We've noted your feedback about the water heater and will have it inspected promptly — we hope to host you again soon for a perfect stay!",
  "improvement_suggestions": [
    "Inspect and upgrade the water heating system to ensure consistent hot water pressure in the mornings"
  ]
}
```

---

## Which Prompt Worked Best and Why

**Prompt Variation 3** is significantly the best for three reasons. First, enforcing a strict JSON-only output format made the backend parsing completely reliable — no regex, no fragile text splitting. Second, providing a **constrained theme vocabulary** ensured consistent, predictable AI output that could be directly rendered in the UI as styled pills. Third, including the **system persona** ("You are an expert hospitality analytics AI") grounded the model's tone and role, resulting in more professional and contextually appropriate management responses. The `temperature: 0.3` generation setting further improved consistency across repeated calls.

---

## System Prompt / Role Used

```
"You are an expert hospitality analytics AI for GuestVoice, a platform that helps 
homestay property owners understand and respond to guest reviews professionally."
```

**Generation settings:**
- `temperature: 0.3` — lower temperature for consistent, structured output
- `max_output_tokens: 512` — sufficient for full JSON without waste
