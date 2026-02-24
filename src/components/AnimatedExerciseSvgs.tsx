import React, { useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

export const JumpSvg = ({ color = "#FF5A00", size = 24 }: { color?: string, size?: number }) => {
  const translateY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(100)
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="7" r="4" />
        <Path d="M12 11v6" />
        <Path d="M12 17l-3 4" />
        <Path d="M12 17l3 4" />
        <Path d="M12 13l-4-2" />
        <Path d="M12 13l4-2" />
        <Line x1="4" y1="22" x2="20" y2="22" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
      </Svg>
    </Animated.View>
  );
};

export const SquatSvg = ({ color = "#FF5A00", size = 24 }: { color?: string, size?: number }) => {
  const translateY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: 4, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="6" r="3" />
        <Path d="M12 9v6" />
        <Path d="M12 15l-3 4" />
        <Path d="M12 15l3 4" />
        <Path d="M8 10h8" />
        <Rect x="4" y="9" width="3" height="5" />
        <Rect x="17" y="9" width="3" height="5" />
      </Svg>
    </Animated.View>
  );
};

export const ShoulderSvg = ({ color = "#1E3A8A", size = 24 }: { color?: string, size?: number }) => {
  const rotate = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="5" r="3" />
        <Path d="M12 8v8" />
        <Path d="M12 16l-3 4" />
        <Path d="M12 16l3 4" />
        <Path d="M12 10c-2 0-4-1-4-3" />
        <Path d="M12 10c2 0 4-1 4-3" />
      </Svg>
    </Animated.View>
  );
};

export const CoreSvg = ({ color = "#10B981", size = 24 }: { color?: string, size?: number }) => {
  const scale = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="5" r="3" />
        <Rect x="8" y="8" width="8" height="10" rx="2" />
        <Line x1="12" y1="18" x2="12" y2="22" />
        <Line x1="10" y1="22" x2="14" y2="22" />
        <Line x1="4" y1="12" x2="8" y2="12" />
        <Line x1="16" y1="12" x2="20" y2="12" />
      </Svg>
    </Animated.View>
  );
};

// Generic Athletic Fallback
export const GenericAthleteSvg = ({ color = "#64748b", size = 24 }: { color?: string, size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="3" />
    <Path d="M12 8v7" />
    <Path d="M12 15l-3 5" />
    <Path d="M12 15l3 5" />
    <Path d="M12 10l-4 2" />
    <Path d="M12 10l4 2" />
  </Svg>
);
