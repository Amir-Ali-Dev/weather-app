import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { CurrentWeather } from "../components/current-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { MapPin, AlertTriangle, RefreshCw, Info } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import { HourlyTemperature } from "../components/hourly-temperature";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteCities } from "@/components/favorite-cities";
import { useState, useCallback } from "react";

interface GeocodingResponse {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

interface LocationError {
  code?: number;
  message: string;
  PERMISSION_DENIED?: number;
  POSITION_UNAVAILABLE?: number;
  TIMEOUT?: number;
}

const DEFAULT_CITY: GeocodingResponse = {
  name: "تهران",
  country: "ایران",
  lat: 35.6895,
  lon: 51.3890
};

export function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const [useDefaultCity, setUseDefaultCity] = useState(false);
  const currentCoordinates = useDefaultCity 
    ? { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon } 
    : coordinates;

  const weatherQuery = useWeatherQuery(currentCoordinates);
  const forecastQuery = useForecastQuery(currentCoordinates);
  const locationQuery = useReverseGeocodeQuery(currentCoordinates);

  const handleRefresh = useCallback(() => {
    setUseDefaultCity(false);
    getLocation();
    weatherQuery.refetch();
    forecastQuery.refetch();
    locationQuery.refetch();
  }, [getLocation, weatherQuery, forecastQuery, locationQuery]);

  const handleUseDefaultCity = useCallback(() => {
    setUseDefaultCity(true);
    weatherQuery.refetch();
    forecastQuery.refetch();
    locationQuery.refetch();
  }, [weatherQuery, forecastQuery, locationQuery]);

  const getLocationError = (error: unknown): string => {
    if (!error) return "خطای ناشناخته در دریافت موقعیت";
    
    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object' && error !== null) {
      const locationError = error as LocationError;
      switch(locationError.code) {
        case locationError.PERMISSION_DENIED:
          return "دسترسی به موقعیت جغرافیایی رد شد. لطفاً در تنظیمات مرورگر خود اجازه دسترسی را فعال کنید.";
        case locationError.POSITION_UNAVAILABLE:
          return "اطلاعات موقعیت در دسترس نیست. ممکن است دستگاه شما از GPS پشتیبانی نکند.";
        case locationError.TIMEOUT:
          return "دریافت موقعیت زمان زیادی طول کشید. لطفاً دوباره تلاش کنید.";
        default:
          return (locationError as any).message || "خطا در دریافت موقعیت جغرافیایی. لطفاً اتصال اینترنت خود را بررسی کنید.";
      }
    }

    return "خطای ناشناخته در دریافت موقعیت";
  };

  if (locationLoading && !useDefaultCity) {
    return <WeatherSkeleton />;
  }

  if (locationError && !useDefaultCity) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <Alert variant="destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-destructive" />
            <div className="space-y-3">
              <AlertTitle className="text-destructive">خطا در دریافت موقعیت</AlertTitle>
              <AlertDescription className="space-y-4">
                <p className="text-muted-foreground">
                  {getLocationError(locationError)}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={getLocation} className="gap-2 flex-1 hover:bg-secondary/80">
                    <RefreshCw className="h-4 w-4" />
                    تلاش مجدد
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleUseDefaultCity} 
                    className="gap-2 flex-1 hover:bg-primary/10"
                  >
                    <MapPin className="h-4 w-4" />
                    نمایش آب و هوای تهران
                  </Button>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (!coordinates && !useDefaultCity) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <Alert>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
            <div className="space-y-3">
              <AlertTitle>نیاز به دسترسی موقعیت</AlertTitle>
              <AlertDescription className="space-y-4">
                <p className="text-muted-foreground">
                  برای نمایش دقیق‌تر آب و هوا، لطفاً دسترسی به موقعیت جغرافیایی را فعال کنید.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={getLocation} className="gap-2 flex-1 hover:bg-secondary/80">
                    <MapPin className="h-4 w-4" />
                    فعال‌سازی موقعیت
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleUseDefaultCity} 
                    className="gap-2 flex-1 hover:bg-primary/10"
                  >
                    <MapPin className="h-4 w-4" />
                    نمایش تهران (بدون موقعیت)
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  بدون دسترسی به موقعیت، اطلاعات آب و هوا برای تهران نمایش داده می‌شود.
                </p>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <Alert variant="destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-destructive" />
            <div className="space-y-3">
              <AlertTitle className="text-destructive">خطا در دریافت اطلاعات آب و هوا</AlertTitle>
              <AlertDescription className="space-y-4">
                <p className="text-muted-foreground">
                  {weatherQuery.error?.message || forecastQuery.error?.message || 
                  "دریافت اطلاعات آب و هوا با مشکل مواجه شد. لطفاً اتصال اینترنت خود را بررسی کنید."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleRefresh} 
                    className="gap-2 flex-1 hover:bg-secondary/80"
                  >
                    <RefreshCw className="h-4 w-4" />
                    تلاش مجدد
                  </Button>
                  {!useDefaultCity && (
                    <Button 
                      variant="secondary" 
                      onClick={handleUseDefaultCity} 
                      className="gap-2 flex-1 hover:bg-primary/10"
                    >
                      <MapPin className="h-4 w-4" />
                      نمایش تهران
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  const getLocationName = (): GeocodingResponse => {
    if (useDefaultCity) return DEFAULT_CITY;
    if (locationQuery.data?.[0]) {
      return {
        name: locationQuery.data[0].name,
        country: locationQuery.data[0].country,
        lat: locationQuery.data[0].lat,
        lon: locationQuery.data[0].lon,
        state: locationQuery.data[0].state
      };
    }
    return {
      name: "موقعیت فعلی",
      country: "",
      lat: currentCoordinates?.lat || 0,
      lon: currentCoordinates?.lon || 0
    };
  };

  const locationName = getLocationName();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <FavoriteCities />
      
      <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {locationName.name}
            {useDefaultCity && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                (پیش‌فرض)
              </span>
            )}
          </h1>
          {locationName.country && (
            <p className="text-sm text-muted-foreground">
              {locationName.country}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          className="rounded-full hover:bg-secondary/50"
          aria-label="بروزرسانی اطلاعات"
        >
          <RefreshCw
            className={`h-5 w-5 ${
              weatherQuery.isFetching || forecastQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <HourlyTemperature data={forecastQuery.data} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <WeatherDetails data={weatherQuery.data} />
          </div>
          <div className="bg-card p-5 rounded-xl shadow-sm">
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </div>
  );
}