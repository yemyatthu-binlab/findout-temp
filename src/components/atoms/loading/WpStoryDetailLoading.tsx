import React from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useBgColor } from "./WpStoryLoading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "@/util/svg/icon.common";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";

const WpStoryDetailSkeleton = () => {
  const { colorScheme } = useColorScheme();
  const { backgroundColor, highlightColor } = useBgColor();
  const navigation = useNavigation();
  const { top: safeAreaTop } = useSafeAreaInsets();

  return (
    <View>
      <View
        className="absolute top-0 left-0 right-0 flex-row items-center justify-center px-4 z-40"
        style={{ height: 100, paddingTop: safeAreaTop }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="absolute left-4 bottom-3 w-[35] h-[35] bg-black/30 rounded-full items-center justify-center active:opacity-80"
        >
          <BackIcon colorScheme={colorScheme} forceLight={true} />
        </Pressable>

      </View>
      <SkeletonPlaceholder borderRadius={8} backgroundColor={backgroundColor} speed={1200} highlightColor={highlightColor}>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item>
            <View className="flex-1">
              <View style={{ width: "100%", height: 300 }} />
            </View>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item marginTop={20} marginBottom={10} flexDirection="row" alignItems="flex-start">
            <SkeletonPlaceholder.Item flex={1}>
              <SkeletonPlaceholder.Item width="30%" height={20} borderRadius={20} marginHorizontal={20} />
              <SkeletonPlaceholder.Item marginTop={6} width="50%" height={20} borderRadius={20} marginHorizontal={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={20} height={20} borderRadius={20} marginHorizontal={10} marginTop={10} />
            <SkeletonPlaceholder.Item width={20} height={20} borderRadius={20} marginRight={10} marginTop={10} />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={30} />
          <SkeletonPlaceholder.Item width="70%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="50%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={40} />
          <SkeletonPlaceholder.Item width="70%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="60%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={30} />
          <SkeletonPlaceholder.Item width="30%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="90%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
          <SkeletonPlaceholder.Item width="50%" height={13} borderRadius={20} marginHorizontal={20} marginTop={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

    </View>
  );
};

export default WpStoryDetailSkeleton;
