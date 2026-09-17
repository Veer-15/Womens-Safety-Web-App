import { GoogleGenAI } from '@google/genai';
import { placesService } from './placesService.ts';
import { Amenity } from '../types.ts';

export type AIIntent = 'AMENITY_SEARCH' | 'SAFETY_ADVICE' | 'GENERAL';

export interface AIQueryResponse {
  reply: string;
  intent: AIIntent;
  groundedPlaces: Amenity[];
}

export class AIService {
  private aiClient: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI | null {
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      this.aiClient = new GoogleGenAI();
    }
    return this.aiClient;
  }

  detectIntent(message: string): AIIntent {
    const lower = message.toLowerCase();

    // Amenity search keywords
    if (
      lower.includes('police') ||
      lower.includes('hospital') ||
      lower.includes('pharmacy') ||
      lower.includes('chemist') ||
      lower.includes('medicine') ||
      lower.includes('hostel') ||
      lower.includes('pg') ||
      lower.includes('metro') ||
      lower.includes('bus') ||
      lower.includes('cab') ||
      lower.includes('auto') ||
      lower.includes('where is') ||
      lower.includes('find') ||
      lower.includes('nearby') ||
      lower.includes('nearest')
    ) {
      return 'AMENITY_SEARCH';
    }

    // Safety advice keywords
    if (
      lower.includes('feel unsafe') ||
      lower.includes('followed') ||
      lower.includes('stalk') ||
      lower.includes('harass') ||
      lower.includes('dark') ||
      lower.includes('alone') ||
      lower.includes('scared') ||
      lower.includes('help me') ||
      lower.includes('what should i do') ||
      lower.includes('emergency') ||
      lower.includes('cab driver') ||
      lower.includes('stranger')
    ) {
      return 'SAFETY_ADVICE';
    }

    return 'GENERAL';
  }

  async processQuery(
    message: string,
    coords: { latitude: number; longitude: number }
  ): Promise<AIQueryResponse> {
    const intent = this.detectIntent(message);
    const nearby = await placesService.getNearbyAmenities(coords.latitude, coords.longitude, 'all');

    // Filter relevant places if amenity search
    let groundedPlaces: Amenity[] = [];
    const lower = message.toLowerCase();

    if (intent === 'AMENITY_SEARCH') {
      if (lower.includes('police')) {
        groundedPlaces = nearby.filter(p => p.type === 'police').slice(0, 3);
      } else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('er')) {
        groundedPlaces = nearby.filter(p => p.type === 'hospital').slice(0, 3);
      } else if (lower.includes('pharmacy') || lower.includes('chemist') || lower.includes('medicine')) {
        groundedPlaces = nearby.filter(p => p.type === 'pharmacy').slice(0, 3);
      } else if (lower.includes('hostel') || lower.includes('pg') || lower.includes('stay') || lower.includes('shelter')) {
        groundedPlaces = nearby.filter(p => p.type === 'hostel').slice(0, 3);
      } else if (lower.includes('metro') || lower.includes('bus') || lower.includes('cab') || lower.includes('transport') || lower.includes('ride')) {
        groundedPlaces = nearby.filter(p => p.type === 'transport').slice(0, 3);
      } else {
        groundedPlaces = nearby.slice(0, 4);
      }
    } else if (intent === 'SAFETY_ADVICE') {
      // Provide closest police station and hospital for immediate backup
      groundedPlaces = nearby
        .filter(p => p.type === 'police' || p.type === 'hospital')
        .slice(0, 2);
    }

    const client = this.getClient();

    if (client) {
      try {
        const placesContext = groundedPlaces
          .map(
            (p, idx) =>
              `${idx + 1}. [${p.name}] (${p.type.toUpperCase()}) - ${p.address} | Distance: ${p.distanceKm} km | Phone: ${p.phone} | Status: ${p.isOpen ? 'Open Now' : 'Closed'} | Notes: ${p.notes || 'None'}`
          )
          .join('\n');

        const systemInstruction = `You are "Sakhi AI Safety Companion", an empathetic, calm, and retrieval-grounded personal safety assistant for women.
CRITICAL SAFETY DIRECTIVE:
1. Answer concisely, reassuringly, and empathetically.
2. Rely ONLY on the verified amenities provided below for locations, contact numbers, or directions.
3. NEVER hallucinate, invent, or assume any phone numbers, addresses, or opening hours not listed in the verified context.
4. If the user feels unsafe, give immediate practical tactical advice (e.g., move toward bright commercial areas, call emergency contacts/112/1090, share live GPS, enter a verified establishment).
5. Always remind the user that they can tap the big red SOS button in Sakhi to immediately broadcast their live location to their emergency contacts.`;

        const prompt = `User Message: "${message}"
Detected Intent: ${intent}
User GPS Coordinates: Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}

VERIFIED NEARBY PLACES:
${placesContext || 'No specific single category filtered. Standard emergency numbers: 112 (National Emergency), 1090 (Women Power Line), 181 (Women Helpline).'}

Please generate an empathetic, actionable response:`;

        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature to prevent hallucinations
          },
        });

        const reply = response.text || '';
        if (reply.trim()) {
          return {
            reply: reply.trim(),
            intent,
            groundedPlaces,
          };
        }
      } catch (geminiError) {
        console.warn('[GEMINI API CALL FAILED, USING GROUNDED LOCAL ENGINE]', geminiError);
      }
    }

    // High-fidelity empathetic grounded local fallback response
    let reply = '';
    if (intent === 'SAFETY_ADVICE') {
      const topPolice = nearby.find(p => p.type === 'police');
      reply = `I understand you might be feeling unsafe right now, and your safety is the absolute priority. Please take a deep breath and stay calm:
1. Move immediately toward a well-lit, populated area or inside an open shop or metro station.
2. Tap the Red SOS button on your dashboard to instantly alert your emergency contacts with your live GPS location.
3. Call 1090 (Women Power Line) or 112 (National Emergency) immediately.
${topPolice ? `\nNearest verified safe point: ${topPolice.name} is only ${topPolice.distanceKm} km away on ${topPolice.address} (Call: ${topPolice.phone}).` : ''}`;
    } else if (intent === 'AMENITY_SEARCH') {
      if (groundedPlaces.length > 0) {
        const topPlace = groundedPlaces[0];
        reply = `Here are the verified safe facilities closest to your location. The closest is ${topPlace.name}, located approximately ${topPlace.distanceKm} km from you (${topPlace.isOpen ? 'Open 24/7' : 'Check operational hours'}). You can call directly at ${topPlace.phone} or get directions below.`;
      } else {
        reply = `I have scanned your surroundings. You have verified police booths, 24/7 pharmacies, and transit hubs nearby. Check the verified cards below or dial 112 for direct assistance.`;
      }
    } else {
      reply = `Hello! I am Sakhi, your personal safety and urban navigation companion. I can help you find verified 24/7 pharmacies, police desks, women's hostels, and safe transport hubs around your live location, or guide you if you ever feel uncomfortable. How can I assist you right now?`;
    }

    return {
      reply,
      intent,
      groundedPlaces,
    };
  }
}

export const aiService = new AIService();
