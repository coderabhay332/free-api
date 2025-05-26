import ServiceSchema from "./service.schema";

export const seedServices = async () => {
  try {
    // Check if weather service already exists
    const existingService = await ServiceSchema.findOne({ endpoint: '/api/services/demo/weather' });
    
    if (!existingService) {
      await ServiceSchema.create({
        name: "Weather API",
        endpoint: "/api/services/demo/weather",
        pricePerCall: 1,
        description: "Get weather information for New York"
      });
      console.log("Weather service created successfully");
    }
  } catch (error) {
    console.error("Error seeding services:", error);
  }
}; 