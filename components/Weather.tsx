import { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image, Pressable, Animated } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

interface WeatherProps {
  onNavigateBack: () => void;
}

const API_KEY = '74bd8fba2cf922b884b178cd2b24bbd6';

export default function Weather({ onNavigateBack }: WeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua para elementos decorativos
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => { 
    const getWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permiso de ubicación denegado');
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});	
        const { latitude, longitude } = location.coords;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`
        );
        const data = await res.json();
        setWeather(data);
        
        // Iniciar animaciones cuando se cargan los datos
        setTimeout(() => startAnimations(), 100);

      } catch (error) {
        console.error(error);
        alert('Error al obtener el clima');
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const LoadingScreen = () => (
    <LinearGradient 
      colors={['#5500dd', '#764ba2', '#493dff']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <StatusBar style="light" />
      <View className="items-center">
        <View className="w-20 h-20 bg-white/15 rounded-full items-center justify-center mb-6">
          <ActivityIndicator size="large" color="#fff" />
        </View>
        <Text className="text-white/80 text-lg font-light">Obteniendo clima...</Text>
      </View>
    </LinearGradient>
  );

  const ErrorScreen = () => (
    <LinearGradient 
      colors={['#5500dd', '#764ba2', '#493dff']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center px-10"
    >
      <StatusBar style="light" />
      <View className="items-center">
        <Text className="text-white text-xl font-semibold text-center mb-6">
          No se pudo obtener la información del clima
        </Text>
        <Pressable 
          onPress={onNavigateBack}
          className="bg-white/20 px-8 py-4 rounded-2xl border border-white/30 active:scale-95"
        >
          <Text className="text-white font-semibold">← Volver al inicio</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );

  if (loading) return <LoadingScreen />;
  if (!weather) return <ErrorScreen />;

  return (
    <LinearGradient
      colors={['#5500dd', '#764ba2', '#493dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <StatusBar style="light" />

      {/* Elementos decorativos del fondo */}
      <View className="absolute inset-0">
        <Animated.View 
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
          className="absolute top-20 right-8 w-32 h-32 bg-white/5 rounded-full"
        />
        <View className="absolute bottom-40 left-6 w-24 h-24 bg-white/8 rounded-full" />
        <Animated.View 
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
          className="absolute top-1/3 left-4 w-16 h-16 bg-white/6 rounded-full"
        />
      </View>
      
      <View className="flex-1 pt-16 px-8">
        {/* Botón de regreso */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
        >
          <Pressable 
            onPress={onNavigateBack}
            className="bg-white/15 px-6 py-3 rounded-2xl mb-8 self-start border border-white/20 active:scale-95"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white font-semibold">← Volver</Text>
          </Pressable>
        </Animated.View>
        
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Información principal */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
            }}
            className="items-center mb-8"
          >
            {/* Ubicación */}
            <Text className="text-white text-3xl font-bold mb-6 text-center tracking-wide">
              {weather.name}
            </Text>

            {/* Icono del clima */}
            <View className="w-48 h-48 bg-white/10 rounded-full items-center justify-center mb-6 border border-white/20"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 12,
              }}
            >
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
                }}
                className="w-36 h-36"
              />
            </View>

            {/* Temperatura principal */}
            <Text className="text-white text-6xl font-bold mb-3 tracking-tight flex items-center justify-center">
              {Math.round(weather.main.temp)}°C
            </Text>
            
            {/* Descripción */}
            <Text className="text-white/80 text-xl font-light mb-2 capitalize text-center">
              {weather.weather[0].description}
            </Text>

            {/* Hora actual */}
            <View className="bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-8">
              <Text className="text-white/90 text-sm font-medium">
                {new Date().toLocaleString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </Animated.View>

          {/* Detalles del clima */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
            className="w-full"
          >
            <View className="bg-white/10 w-full rounded-3xl p-4 border border-white/20"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 10,
              }}
            >
              <Text className="text-white text-lg font-semibold mb-5 text-center">
                Detalles del Clima
              </Text>
              
              <View className="space-y-4">
             
                
                <View className="flex-row items-center justify-between bg-white/5 p-4 rounded-2xl">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-1">💧</Text>
                    <Text className="text-white text-base font-medium">Humedad</Text>
                  </View>
                  <Text className="text-white text-lg font-bold">
                    {weather.main.humidity}%
                  </Text>
                </View>
                
                <View className="flex-row items-center justify-between bg-white/5 p-4 rounded-2xl">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-1">🌬️</Text>
                    <Text className="text-white text-base font-medium">Viento</Text>
                  </View>
                  <Text className="text-white text-lg font-bold">
                    {weather.wind.speed} m/s
                  </Text>
                </View>

                {weather.main.pressure && (
                  <View className="flex-row items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-1">🔽</Text>
                      <Text className="text-white text-base font-medium">Presión</Text>
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {weather.main.pressure} hPa
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Elemento decorativo inferior */}
      <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </LinearGradient>
  );
}