import { View, Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

interface HomeProps {
  onNavigateToWeather: () => void;
}

export default function Home({ onNavigateToWeather }: HomeProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#5500dd', '#764ba2', '#493dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <StatusBar style="light" />
      
      {/* Elementos decorativos del fondo - reducidos */}
      <View className="absolute inset-0">
        <View className="absolute top-24 left-12 w-24 h-24 bg-white/5 rounded-full" />
        <View className="absolute bottom-32 right-10 w-28 h-28 bg-white/8 rounded-full" />
      </View>

      <View className="flex-1 items-center justify-center px-10">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center mb-16"
        >
          {/* Icono del clima */}
          <View className="w-28 h-28 bg-white/15 rounded-full items-center justify-center mb-10 shadow-lg">
            <Text className="text-5xl"></Text>
          </View>

          {/* Título principal */}
          <Text className="text-white text-4xl font-bold text-center mb-6 tracking-wide">
            Mi Clima
          </Text>
          
          {/* Subtítulo */}
          <Text className="text-white/75 text-base text-center font-light mb-8">
            Descubre el clima en tu ubicación
          </Text>
          
          {/* Indicador de hora actual */}
         
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="w-full items-center"
        >
          {/* Botón principal */}
          <Pressable
            onPress={onNavigateToWeather}
            className="bg-gradient-to-r from-white/20 to-white/10 w-full py-5 rounded-3xl border border-white/25 shadow-xl active:scale-95"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 15,
              elevation: 12,
            }}
          >
            <View className="items-center">
              <Text className="text-white text-lg font-semibold m-4">
                 Ver Clima Actual
              </Text>
            
            </View>
          </Pressable>
        </Animated.View>
      </View>

      
      <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </LinearGradient>
  );
}