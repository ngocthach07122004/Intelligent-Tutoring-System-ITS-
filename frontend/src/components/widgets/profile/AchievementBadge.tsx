"use client";

import { Trophy, Star, Users, Crown, Sparkles, BookOpen, Calendar, Target, Award, Microscope } from "lucide-react";
import { Achievement } from "../../lib/BE-library/student-interfaces";

type BadgeSize = "small" | "medium" | "large";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  star: Star,
  award: Award,
  sparkles: Sparkles,
  microscope: Microscope,
  book: BookOpen,
  calendar: Calendar,
  target: Target,
  crown: Crown,
  users: Users,
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: BadgeSize;
  showProgress?: boolean;
}

export const AchievementBadge = ({ achievement, size = "medium", showProgress = false }: AchievementBadgeProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return { container: "p-3", icon: "text-2xl", title: "text-sm", description: "text-xs" };
      case "large":
        return { container: "p-6", icon: "text-5xl", title: "text-lg", description: "text-sm" };
      default:
        return { container: "p-4", icon: "text-3xl", title: "text-base", description: "text-sm" };
    }
  };

  const getRarityStyles = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return {
          border: "border-gray-900",
          bg: achievement.isEarned ? "bg-gray-900" : "bg-gray-50",
          shadow: achievement.isEarned ? "shadow-lg shadow-gray-400/50" : "shadow-md",
          titleColor: achievement.isEarned ? "text-white" : "text-gray-400",
          descColor: achievement.isEarned ? "text-gray-200" : "text-gray-400",
          glow: achievement.isEarned ? "ring-2 ring-gray-300" : "",
        };
      case "rare":
        return {
          border: "border-gray-800",
          bg: achievement.isEarned ? "bg-gray-800" : "bg-gray-50",
          shadow: achievement.isEarned ? "shadow-lg shadow-gray-300/50" : "shadow-md",
          titleColor: achievement.isEarned ? "text-white" : "text-gray-400",
          descColor: achievement.isEarned ? "text-gray-200" : "text-gray-400",
          glow: achievement.isEarned ? "ring-2 ring-gray-300" : "",
        };
      case "uncommon":
        return {
          border: "border-gray-700",
          bg: achievement.isEarned ? "bg-gray-700" : "bg-gray-50",
          shadow: achievement.isEarned ? "shadow-lg shadow-gray-300/50" : "shadow-md",
          titleColor: achievement.isEarned ? "text-white" : "text-gray-400",
          descColor: achievement.isEarned ? "text-gray-200" : "text-gray-400",
          glow: achievement.isEarned ? "ring-2 ring-gray-300" : "",
        };
      default:
        return {
          border: "border-gray-600",
          bg: achievement.isEarned ? "bg-gray-600" : "bg-gray-50",
          shadow: achievement.isEarned ? "shadow-lg shadow-gray-300/50" : "shadow-md",
          titleColor: achievement.isEarned ? "text-white" : "text-gray-400",
          descColor: achievement.isEarned ? "text-gray-200" : "text-gray-400",
          glow: achievement.isEarned ? "ring-2 ring-gray-300" : "",
        };
    }
  };

  const getCategoryStyles = (category?: string) => {
    switch (category) {
      case "academic":
      case "attendance":
      case "participation":
      case "leadership":
      case "special":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "academic":
        return <BookOpen className="w-3 h-3 inline mr-1" />;
      case "attendance":
        return <Calendar className="w-3 h-3 inline mr-1" />;
      case "participation":
        return <Users className="w-3 h-3 inline mr-1" />;
      case "leadership":
        return <Crown className="w-3 h-3 inline mr-1" />;
      case "special":
        return <Star className="w-3 h-3 inline mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "academic":
        return "Hoc tap";
      case "attendance":
        return "Chuyen can";
      case "participation":
        return "Tham gia";
      case "leadership":
        return "Lanh dao";
      case "special":
        return "Dac biet";
      default:
        return "";
    }
  };

  const getRarityLabel = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "Huyen thoai";
      case "rare":
        return "Hiem";
      case "uncommon":
        return "Kha hiem";
      case "common":
        return "Thuong";
      default:
        return "";
    }
  };

  const getProgressPercentage = () => {
    if (!achievement.progress) return 0;
    return ((achievement.progress.current ?? 0) / (achievement.progress.target ?? 1)) * 100;
  };

  const sizeClasses = getSizeClasses();
  const rarityStyles = getRarityStyles(achievement.rarity);
  const IconComponent = iconMap[achievement.icon ?? ""] || Trophy;

  return (
    <div
      className={`
        relative rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer
        ${rarityStyles.border} ${rarityStyles.bg} ${rarityStyles.shadow} ${rarityStyles.glow}
        ${sizeClasses.container}
        ${!achievement.isEarned ? "grayscale opacity-60" : ""}
      `}
    >
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryStyles(achievement.category)}`}>
          {getRarityLabel(achievement.rarity)}
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className={`${sizeClasses.icon} mb-3 p-4 rounded-full ${
            achievement.isEarned ? "bg-white" : "bg-gray-100"
          }`}
        >
          <IconComponent
            className={`w-full h-full ${achievement.isEarned ? "text-gray-900" : "text-gray-400"}`}
          />
        </div>

        <h3 className={`font-bold ${sizeClasses.title} ${rarityStyles.titleColor} mb-1`}>{achievement.title}</h3>

        <p className={`${sizeClasses.description} ${rarityStyles.descColor} mb-3 leading-relaxed`}>
          {achievement.description}
        </p>

        {!achievement.isEarned && achievement.progress && showProgress && (
          <div className="w-full mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
              <span>Tien do</span>
              <span>
                {achievement.progress.current ?? 0}/{achievement.progress.target ?? 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gray-800 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium">
              {getProgressPercentage().toFixed(1)}% hoan thanh
            </div>
          </div>
        )}

        {achievement.isEarned && achievement.earnedDate && (
          <div className="text-xs text-gray-500 mt-2 font-medium">
            Dat duoc: {new Date(achievement.earnedDate).toLocaleDateString("vi-VN")}
          </div>
        )}

        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold mt-3 ${getCategoryStyles(achievement.category)}`}>
          {getCategoryIcon(achievement.category)}
          {getCategoryLabel(achievement.category)}
        </div>
      </div>

      {achievement.isEarned && (
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform rotate-45 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

interface AchievementGridProps {
  achievements: Achievement[];
  filter?: "all" | "earned" | "unearned";
  category?: Achievement["category"] | "all";
}

export const AchievementGrid = ({ achievements, filter = "all", category = "all" }: AchievementGridProps) => {
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "earned" && achievement.isEarned) ||
      (filter === "unearned" && !achievement.isEarned);

    const matchesCategory = category === "all" || achievement.category === category;

    return matchesFilter && matchesCategory;
  });

  const earnedCount = achievements.filter((a) => a.isEarned).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Thanh tich</h2>
            <p className="text-gray-600 font-medium">Theo doi qua trinh hoc tap</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {earnedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-500 font-medium mb-2">Da dat duoc</div>
            <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gray-900 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${totalCount === 0 ? 0 : (earnedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} showProgress={!achievement.isEarned} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-gray-200">
          <div className="mb-4 flex justify-center">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
              <Trophy className="w-16 h-16 text-gray-700" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Khong co thanh tich</h3>
          <p className="text-gray-500 font-medium">Tiep tuc hoc tap de nhan duoc nhieu thanh tich moi!</p>
        </div>
      )}
    </div>
  );
};
