// src/components/hourly-temperature.tsx
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/api/types";

interface HourlyTemperatureProps {
  data: ForecastData;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  // پیاده‌سازی نمایش دمای ساعتی
  return (
    <Card>
      <CardHeader>
        <CardTitle>دمای ساعتی</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.list.slice(0, 8).map((hour) => (
            <div key={hour.dt} className="flex items-center justify-between">
              <span>
                {new Date(hour.dt * 1000).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                })}
              </span>
              <span>{Math.round(hour.main.temp)}°C</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}