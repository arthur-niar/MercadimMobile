import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { formatCurrency } from "@/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "expo-router";
import { Skeleton } from "@/components/Skeleton";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
interface SaleItem {
  name: string;
  quantity: number;
  color: string;
}

interface HomeViewProps {
  username: string;
  profilePhotoUrl?: string | null;
  totalSales: number;
  itemsSold: number;
  itemsReceived: number;
  averageTicket: number;
  salesItems: SaleItem[];
  unreadCount?: number;
  latestNotification?: {
    id: number;
    title: string;
    description: string;
    type?: string;
  } | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSettingsPress: () => void;
  onReportPress: () => void;
  onMarkNotificationAsRead?: (notificationId: number) => void;
  insights?: string[];
  insightsLoading?: boolean;
}

const UserIcon = ({ color = "#9CA3AF" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <Path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const SettingsIcon = ({ color = "#374151" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const NotificationIcon = ({ color = "#374151" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 17a3 3 0 006 0"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const ReportIcon = ({ color = "#374151" }: { color?: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke={color}
      strokeWidth="1.6"
    />
    <Path
      d="M8 8h8M8 12h8M8 16h5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
);

const SummaryCard = ({
  value,
  label,
  color,
  fontScale,
}: {
  value: string;
  label: string;
  color: string;
  fontScale: number;
}) => (
  <View
    style={{
      flex: 1,
      backgroundColor: color,
      borderRadius: 16,
      padding: 14,
      minHeight: 80,
      justifyContent: "flex-end",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 17 * fontScale,
        fontWeight: "800",
        marginBottom: 2,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: 10 * fontScale,
        lineHeight: 13,
      }}
    >
      {label}
    </Text>
  </View>
);

// Controle de exibição automática de insights por sessão de uso do app
let hasSeenInsightsThisSession = false;

export const HomeView = ({
  username,
  profilePhotoUrl,
  totalSales,
  itemsSold,
  itemsReceived,
  averageTicket,
  salesItems,
  unreadCount = 0,
  latestNotification,
  loading = false,
  error = null,
  onRefresh,
  onSettingsPress,
  onReportPress,
  onMarkNotificationAsRead,
  insights = [],
  insightsLoading = false,
}: HomeViewProps) => {
  const { isDark, fontScale } = useSettings();
  const { t } = useTranslation();

  const router = useRouter();

  const [showNotificationPopup, setShowNotificationPopup] =
    React.useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = React.useState(0);

  const handleCloseNotification = React.useCallback(() => {
    if (latestNotification && onMarkNotificationAsRead) {
      onMarkNotificationAsRead(latestNotification.id);
    }
    setShowNotificationPopup(false);
  }, [latestNotification, onMarkNotificationAsRead]);

  const handleNextInsight = () => {
    if (insights && currentInsightIndex < insights.length - 1) {
      setCurrentInsightIndex((prev: number) => prev + 1);
    } else {
      setShowNotificationPopup(false);
    }
  };

  const handleOpenInsightsManually = () => {
    if (insights && insights.length > 0) {
      setCurrentInsightIndex(0);
      setShowNotificationPopup(true);
    }
  };

  React.useEffect(() => {
    if (insights && insights.length > 0 && !hasSeenInsightsThisSession) {
      setShowNotificationPopup(true);
      setCurrentInsightIndex(0);
      hasSeenInsightsThisSession = true;
    }
  }, [insights]);

  React.useEffect(() => {
    if (latestNotification && (!insights || insights.length === 0)) {
      setShowNotificationPopup(true);
      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [latestNotification, insights, handleCloseNotification]);

  const screenBg = isDark ? "#0B0B0D" : "#fff";
  const contentBg = isDark ? "#0B0B0D" : "#F5F5F5";
  const cardBg = isDark ? "#17181B" : "#fff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB";
  const textColor = isDark ? "#F3F4F6" : "#111827";
  const subTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const labelColor = isDark ? "#9CA3AF" : "#9CA3AF";
  const iconBtnBg = isDark ? "#27282C" : "#F3F4F6";
  const iconColor = isDark ? "#D1D5DB" : "#374151";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6";
  const emptyIconBg = isDark ? "#3A2412" : "#FFF7ED";

  const hasSales =
    salesItems.length > 0 && salesItems.some((i: SaleItem) => i.quantity > 0);
  const totalQuantity = salesItems.reduce(
    (sum: number, item: SaleItem) => sum + item.quantity,
    0,
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      hasSeenInsightsThisSession = false;
      await onRefresh();
      setRefreshing(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: screenBg }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={screenBg}
        />
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Skeleton width={42} height={42} borderRadius={21} />
              <View style={{ gap: 4 }}>
                <Skeleton width={60} height={12} />
                <Skeleton width={100} height={16} />
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Skeleton width={42} height={42} borderRadius={12} />
              <Skeleton width={42} height={42} borderRadius={12} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={16} />
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={16} />
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={16} />
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={16} />
          </View>

          <Skeleton
            height={50}
            borderRadius={14}
            style={{ marginBottom: 16 }}
          />
          <Skeleton height={200} borderRadius={16} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: screenBg }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBg}
      />

      <View
        style={{
          backgroundColor: screenBg,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: iconBtnBg,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {profilePhotoUrl ? (
              <Image
                source={{ uri: profilePhotoUrl }}
                style={{ width: 42, height: 42 }}
              />
            ) : (
              <UserIcon />
            )}
          </View>
          <View>
            <Text style={{ fontSize: 12 * fontScale, color: labelColor }}>
              {t("home.greeting")}
            </Text>
            <Text
              style={{
                fontSize: 16 * fontScale,
                fontWeight: "700",
                color: textColor,
              }}
            >
              {username || t("home.user")}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push("/notifications" as any)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: iconBtnBg,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
            activeOpacity={0.7}
          >
            <NotificationIcon color={iconColor} />

            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#EF4444",
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10 * fontScale,
                    fontWeight: "700",
                  }}
                >
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSettingsPress}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: iconBtnBg,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.7}
          >
            <SettingsIcon color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {showNotificationPopup && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <TouchableOpacity
              onPress={handleCloseNotification}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: subTextColor,
                  fontSize: 18 * fontScale,
                  fontWeight: "700",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>

            {insights && insights.length > 0 ? (
              <View style={{ width: "100%" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9.812 18.062a1 1 0 0 1-.707-.293l-4.243-4.243a1 1 0 1 1 1.414-1.414l3.536 3.536 7.778-7.778a1 1 0 1 1 1.414 1.414l-8.485 8.485a1 1 0 0 1-.707.293z"
                      fill="#FF662A"
                    />
                  </Svg>
                  <Text
                    style={{
                      color: "#FF662A",
                      fontSize: 12 * fontScale,
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {t("home.insightsPopupTitle", { current: currentInsightIndex + 1, total: insights.length })}
                  </Text>
                </View>

                <Text
                  style={{
                    color: textColor,
                    fontSize: 14 * fontScale,
                    lineHeight: 22,
                    marginBottom: 16,
                    fontWeight: "600",
                  }}
                >
                  {insights[currentInsightIndex]}
                </Text>

                <TouchableOpacity
                  onPress={handleNextInsight}
                  style={{
                    backgroundColor: "#FF662A",
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14 * fontScale,
                      fontWeight: "700",
                    }}
                  >
                    {currentInsightIndex < insights.length - 1 ? t("common.next") : t("common.close")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    color: textColor,
                    fontSize: 16 * fontScale,
                    fontWeight: "800",
                    marginBottom: 8,
                    paddingRight: 28,
                  }}
                >
                  {latestNotification?.type === "venda"
                    ? t("notifications.saleTitle")
                    : latestNotification?.type === "estoque_baixo"
                      ? t("notifications.lowStockTitle")
                      : latestNotification?.type === "estoque_entrada"
                        ? t("notifications.estoqueEntradaTitle")
                        : latestNotification?.title}
                </Text>

                <Text
                  style={{
                    color: subTextColor,
                    fontSize: 13 * fontScale,
                    lineHeight: 20,
                  }}
                >
                  {latestNotification?.type === "venda"
                    ? t("notifications.saleDesc")
                    : latestNotification?.type === "estoque_baixo"
                      ? t("notifications.lowStockDesc", {
                          name: latestNotification?.description,
                        })
                      : latestNotification?.type === "estoque_entrada"
                        ? t("notifications.estoqueEntradaDesc", {
                            name: latestNotification?.description,
                          })
                        : latestNotification?.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: contentBg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF662A"]}
            tintColor="#FF662A"
          />
        }
      >
        {error && (
          <View
            style={{
              backgroundColor: isDark ? "#3F1212" : "#FEE2E2",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#EF4444",
            }}
          >
            <Text
              style={{
                fontSize: 13 * fontScale,
                fontWeight: "600",
                color: isDark ? "#FCA5A5" : "#991B1B",
                marginBottom: 4,
              }}
            >
              {t("home.errorLoading")}
            </Text>
            <Text
              style={{
                fontSize: 12 * fontScale,
                color: isDark ? "#F87171" : "#7F1D1D",
              }}
            >
              {error}
            </Text>
          </View>
        )}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
        >
          <SummaryCard
            value={formatCurrency(totalSales)}
            label={t("home.totalSales")}
            color="#FF8C3A"
            fontScale={fontScale}
          />
          <SummaryCard
            value={`${itemsSold} Unid.`}
            label={t("home.itemsSold")}
            color="#FCA53A"
            fontScale={fontScale}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}
        >
          <SummaryCard
            value={`${itemsReceived} Unid.`}
            label={t("home.itemsReceived")}
            color="#FF7A2A"
            fontScale={fontScale}
          />
          <SummaryCard
            value={formatCurrency(averageTicket)}
            label={t("home.averageTicket")}
            color="#FFB84A"
            fontScale={fontScale}
          />
        </Animated.View>

        {/* Card Premium de Insights da IA */}
        <Animated.View entering={FadeInDown.delay(250)}>
          <TouchableOpacity
            onPress={handleOpenInsightsManually}
            disabled={insights.length === 0 && !insightsLoading}
            style={{
              backgroundColor: isDark ? "#1E140C" : "#FFF7ED",
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: isDark ? "#FF662A" : "#FFE3D5",
              position: "relative",
              overflow: "hidden",
            }}
            activeOpacity={0.8}
          >
            {/* Efeito de Gradiente/Brilho sutil no canto */}
            <View
              style={{
                position: "absolute",
                right: -20,
                top: -20,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255, 102, 42, 0.12)",
              }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 21h6a1 1 0 001-1v-1H8v1a1 1 0 001 1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16H10v-2.3l-.85-.6A4.996 4.996 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.78 3.1-2.15 4.1z"
                  fill="#FF662A"
                />
              </Svg>
              <Text
                style={{
                  color: "#FF662A",
                  fontSize: 12 * fontScale,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {t("home.insightsTitle")}
              </Text>
              {insightsLoading && (
                <ActivityIndicator size="small" color="#FF662A" style={{ marginLeft: 4 }} />
              )}
            </View>

            {insightsLoading ? (
              <Text style={{ fontSize: 13 * fontScale, color: subTextColor, fontStyle: "italic" }}>
                {t("home.insightsLoading")}
              </Text>
            ) : insights.length > 0 ? (
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    color: textColor,
                    fontSize: 13 * fontScale,
                    fontWeight: "600",
                    lineHeight: 18,
                    marginBottom: 6,
                  }}
                >
                  "{insights[0]}"
                </Text>
                <Text
                  style={{
                    color: "#FF662A",
                    fontSize: 11 * fontScale,
                    fontWeight: "700",
                  }}
                >
                  {t("home.insightsTapToSee", { count: insights.length })}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 13 * fontScale, color: subTextColor }}>
                {t("home.insightsNone")}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <TouchableOpacity
            onPress={onReportPress}
            style={{
              backgroundColor: cardBg,
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
            activeOpacity={0.7}
          >
            <ReportIcon color={iconColor} />
            <Text
              style={{
                fontSize: 14 * fontScale,
                fontWeight: "600",
                color: isDark ? "#D1D5DB" : "#374151",
              }}
            >
              {t("home.salesReport")}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          {hasSales ? (
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 16,
                borderWidth: 0.5,
                borderColor: cardBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 15 * fontScale,
                  fontWeight: "800",
                  color: textColor,
                  marginBottom: 12,
                }}
              >
                {t("home.productSales")}
              </Text>
              <View
                style={{
                  height: 10,
                  borderRadius: 5,
                  overflow: "hidden",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                {salesItems.map((item: SaleItem, index: number) => (
                  <View
                    key={index}
                    style={{
                      flex: item.quantity / totalQuantity,
                      backgroundColor: item.color,
                    }}
                  />
                ))}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {salesItems.map((item: SaleItem, index: number) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text
                      style={{ fontSize: 11 * fontScale, color: subTextColor }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: dividerColor }}>
                {salesItems.map((item: SaleItem, index: number) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 10,
                      borderBottomWidth: index < salesItems.length - 1 ? 1 : 0,
                      borderBottomColor: dividerColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14 * fontScale,
                        fontWeight: "600",
                        color: textColor,
                      }}
                    >
                      {item.name}
                    </Text>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 14 * fontScale,
                          fontWeight: "700",
                          color: textColor,
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Text
                        style={{ fontSize: 10 * fontScale, color: labelColor }}
                      >
                        {t("home.sales")}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 28,
                alignItems: "center",
                borderWidth: 0.5,
                borderColor: cardBorder,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: emptyIconBg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <Rect
                    x="5"
                    y="2"
                    width="14"
                    height="17"
                    rx="2"
                    stroke="#FF662A"
                    strokeWidth="1.8"
                  />
                  <Path
                    d="M9 2v2a1 1 0 001 1h4a1 1 0 001-1V2"
                    stroke="#FF662A"
                    strokeWidth="1.8"
                  />
                  <Path
                    d="M9 10l1.5 1.5L13 8"
                    stroke="#FF662A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text
                style={{
                  fontSize: 14 * fontScale,
                  fontWeight: "700",
                  color: textColor,
                  marginBottom: 6,
                }}
              >
                {t("home.noSales")}
              </Text>
              <Text
                style={{
                  fontSize: 12 * fontScale,
                  color: labelColor,
                  textAlign: "center",
                  lineHeight: 18,
                }}
              >
                {t("home.noSalesDescription")}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};
