import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

async function callClaudeAPI(prompt, systemPrompt = '') {
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    throw new Error('AI service unavailable');
  }
}

export const aiPricingAdjuster = async (data) => {
  const { distance, cargoSize, currentDrivers, activeBookings, timeOfDay, weather } = data;

  const prompt = `You are a dynamic pricing expert for a logistics platform. Analyze the following data and recommend an optimal surge multiplier:

Distance: ${distance} km
Cargo Size: ${cargoSize}
Available Drivers Online: ${currentDrivers}
Active Bookings: ${activeBookings}
Time of Day: ${timeOfDay}
Weather Conditions: ${weather || 'normal'}

Base pricing rules:
- Base fare: ₹50
- Per km rate: ₹12
- Cargo size multipliers: XS=1x, S=1.2x, M=1.5x, L=2x, XL=2.5x

Consider:
1. Supply-demand ratio (drivers vs bookings)
2. Time-based demand patterns (peak hours)
3. Weather impact on driver availability
4. Distance efficiency

Respond ONLY with a JSON object in this exact format:
{
  "surgeMultiplier": <number between 1.0 and 2.5>,
  "reasoning": "<brief explanation>",
  "estimatedFare": <calculated total fare>
}`;

  const systemPrompt = 'You are a pricing optimization AI. Always respond with valid JSON only, no other text.';

  const response = await callClaudeAPI(prompt, systemPrompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      surgeMultiplier: 1.0,
      reasoning: 'Normal pricing applied',
      estimatedFare: 50 + (distance * 12)
    };
  }
};

export const aiCargoClassifier = async (data) => {
  const { description, photoUrl } = data;

  let prompt = `You are a cargo classification expert. Analyze this delivery item description and classify it:

Description: "${description}"

Classify the cargo and respond ONLY with a JSON object in this exact format:
{
  "category": "<electronics|groceries|documents|furniture|clothing|food|medical|other>",
  "recommendedSize": "<XS|S|M|L|XL>",
  "fragile": <true|false>,
  "requiresInsurance": <true|false>,
  "specialHandling": "<description or null>",
  "estimatedWeight": "<weight in kg>"
}`;

  if (photoUrl) {
    prompt += `\n\nPhoto URL provided: ${photoUrl}\nNote: Adjust classification based on visual analysis if possible.`;
  }

  const systemPrompt = 'You are a logistics cargo classification AI. Always respond with valid JSON only.';

  const response = await callClaudeAPI(prompt, systemPrompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      category: 'other',
      recommendedSize: 'M',
      fragile: false,
      requiresInsurance: false,
      specialHandling: null,
      estimatedWeight: '1-5'
    };
  }
};

export const aiRouteAdvisor = async (data) => {
  const { pickup, drop, currentTraffic, timeOfDay, weather } = data;

  const prompt = `You are a route optimization expert. Analyze this delivery route and provide recommendations:

Pickup Location: ${pickup.address} (${pickup.lat}, ${pickup.lng})
Drop Location: ${drop.address} (${drop.lat}, ${drop.lng})
Current Traffic: ${currentTraffic || 'moderate'}
Time of Day: ${timeOfDay}
Weather: ${weather || 'clear'}

Provide route recommendations considering:
1. Traffic patterns
2. Road safety
3. Time efficiency
4. Weather conditions

Respond ONLY with a JSON object:
{
  "recommendedRoute": "<primary route description>",
  "alternateRoute": "<backup route or null>",
  "estimatedTime": <minutes>,
  "safetyRating": <1-5>,
  "trafficWarnings": ["<warning1>", "<warning2>"],
  "suggestions": "<driver tips>"
}`;

  const systemPrompt = 'You are a route planning AI for logistics. Always respond with valid JSON only.';

  const response = await callClaudeAPI(prompt, systemPrompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      recommendedRoute: 'Shortest path via main roads',
      alternateRoute: null,
      estimatedTime: 30,
      safetyRating: 4,
      trafficWarnings: [],
      suggestions: 'Follow GPS navigation'
    };
  }
};

export const aiBusinessInsights = async (data) => {
  const { deliveries, revenue, period, topRoutes, driverStats } = data;

  const prompt = `You are a business analytics expert for a logistics platform. Generate insights from this data:

Period: ${period}
Total Deliveries: ${deliveries.total}
Completed: ${deliveries.completed}
Cancelled: ${deliveries.cancelled}
Revenue: ₹${revenue.total}
Average Order Value: ₹${revenue.average}

Top Routes: ${JSON.stringify(topRoutes, null, 2)}
Driver Statistics: ${JSON.stringify(driverStats, null, 2)}

Provide actionable business insights and respond ONLY with a JSON object:
{
  "summary": "<executive summary>",
  "keyMetrics": {
    "growthRate": "<percentage>",
    "completionRate": "<percentage>",
    "averageDeliveryTime": "<minutes>"
  },
  "insights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>"
  ],
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>"
  ],
  "opportunities": [
    "<opportunity 1>",
    "<opportunity 2>"
  ]
}`;

  const systemPrompt = 'You are a business intelligence AI for logistics. Always respond with valid JSON only.';

  const response = await callClaudeAPI(prompt, systemPrompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      summary: 'Business performance summary unavailable',
      keyMetrics: {
        growthRate: 'N/A',
        completionRate: 'N/A',
        averageDeliveryTime: 'N/A'
      },
      insights: [],
      recommendations: [],
      opportunities: []
    };
  }
};
