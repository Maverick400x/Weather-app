import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    // 🌍 Step 1: Fetch latitude and longitude (for state & country)
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { lat, lon, name, state, country } = geoData[0];

    // 🌤 Step 2: Fetch weather using coordinates
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const weatherData = await weatherRes.json();

    // Merge extra details
    const combinedData = {
      ...weatherData,
      name,
      state,
      sys: { ...weatherData.sys, country },
    };

    return NextResponse.json(combinedData);
  } catch (err) {
    console.error("Error fetching weather:", err);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
