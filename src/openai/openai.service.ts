import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
    private readonly client: OpenAI;
    private readonly endpoint: string = "https://models.github.ai/inference";
    private readonly model: string = "openai/gpt-4o";

    constructor() {
        this.client = new OpenAI({
            baseURL: this.endpoint,
            apiKey: process.env.GITHUB_TOKEN,
        });
    }

    async generateCaptainTravelReason(
        destination: string,
        interests: string[],
        travelMonth: string,
        tripLength: number,
        travelStyle: string,
        temperaturePreference: string
    ): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: `
                        You are Captain Travo — the energetic, charming, and over-the-top airline captain.

                        Your job is to recommend a specific travel destination in a fun, vivid, and memorable way that feels personal and relevant to the user.

                        What you must do:
                        - Start by introducing yourself and affirming the destination with excitement (for example: “Captain Travo here! Welcome aboard your dream trip to Tokyo!”).
                        - Speak directly to the traveler. Use “you,” and reference their trip details (interests, travel style, weather preference, etc.).
                        - Highlight 2–3 clear, specific reasons they’d love this destination — based on what they like (e.g., food, adventure, beaches, history).
                        - Write in a playful, high-energy, airline-captain tone — think dramatic announcements, inside knowledge, and wanderlust.
                        - Avoid using aviation jargon (e.g., "co-pilot", "crew", "flight deck") when referring to the traveler or their companions.
                        - End with **one short sign-off line** like:
                        - "Captain Travo, signing off — buckle up for adventure!"
                        - "Wheels up soon, traveler — this one’s gonna be unforgettable!"
                        - "Clear skies ahead — see you in paradise!"

                        Format:
                        - Keep the response to **1 short paragraph** (around 5–7 sentences max).
                        - Don’t list facts — paint a picture with energy and purpose.
                        - Avoid pirate talk or generic text. Be punchy, exciting, and crystal clear on *why* this destination is perfect for the traveler.
                    `.trim(),
                },
                {
                    role: 'user',
                    content: `
                        I'm planning a ${tripLength}-day trip in ${travelMonth}. 
                        I love ${interests.join(', ')} and prefer a ${travelStyle} travel style. 
                        I enjoy ${temperaturePreference} weather. 

                        Why should I visit ${destination}? 
                    `
                },
            ],
            temperature: 0.7,
        });

        return response.choices[0].message.content ?? 'Oh no! Captain Travo lost his map. Try again later.';
    }

    async generateRecommendedDestination(
        departureLocation: string,
        interests: string[],
        travelMonth: string,
        tripLength: number,
        travelStyle: string,
        temperaturePreference: string
    ): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                {
                role: 'system',
                content: `
                    Your task is to recommend 5 to 10 travel destinations based on the user's preferences.
                    Use the departure location, interests, travel month, trip length, travel style, and temperature preference.
                    Respond ONLY with a numbered list of city and country pairs, one per line, with no extra text.
                    Example:
                    1. Paris, France
                    2. Rome, Italy
                    3. Lisbon, Portugal
                `.trim(),
                },
                {
                role: 'user',
                content: `
                    Departure location: ${departureLocation}
                    Interests: ${interests.join(', ')}
                    Travel month: ${travelMonth}
                    Trip length: ${tripLength} days
                    Travel style: ${travelStyle}
                    Temperature preference: ${temperaturePreference}

                    Please list 5 to 10 suitable travel destinations.
                `,
                },
            ],
            temperature: 0.8,
            top_p: 0.7,
        });

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
        return 'Captain Travo couldn\'t find a destination this time!';
        }

        const listText = content.trim();
        const destinations = listText
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);

        // The AI is too bread-headed so we have to make it list a bunch of destinations and manually randomly choose
        // I did this because letting the AI choose it's own single destination kills its creativity, making it list the same dest each time.
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];

        return randomDestination ?? 'Captain Travo couldn\'t find a destination this time!';
    }

}
