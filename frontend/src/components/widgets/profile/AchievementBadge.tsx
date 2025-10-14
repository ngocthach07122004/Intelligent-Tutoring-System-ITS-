"use client";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academic' | 'attendance' | 'participation' | 'leadership' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  earnedDate?: string;
  progress?: {
    current: number;
    target: number;
  };
  isEarned: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export const AchievementBadge = ({ 
  achievement, 
  size = 'medium', 
  showProgress = false 
}: AchievementBadgeProps) => {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-3',
          icon: 'text-2xl',
          title: 'text-sm',
          description: 'text-xs'
        };
      case 'large':
        return {
          container: 'p-6',
          icon: 'text-5xl',
          title: 'text-lg',
          description: 'text-sm'
        };
      default:
        return {
          container: 'p-4',
          icon: 'text-3xl',
          title: 'text-base',
          description: 'text-sm'
        };
    }
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-yellow-400',
          bg: achievement.isEarned ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50',
          shadow: achievement.isEarned ? 'shadow-lg shadow-yellow-200/50' : 'shadow-md',
          titleColor: achievement.isEarned ? 'text-yellow-800' : 'text-gray-400',
          descColor: achievement.isEarned ? 'text-yellow-600' : 'text-gray-400',
          glow: achievement.isEarned ? 'ring-2 ring-yellow-200' : ''
        };
      case 'rare':
        return {
          border: 'border-purple-400',
          bg: achievement.isEarned ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-gray-50',
          shadow: achievement.isEarned ? 'shadow-lg shadow-purple-200/50' : 'shadow-md',
          titleColor: achievement.isEarned ? 'text-purple-800' : 'text-gray-400',
          descColor: achievement.isEarned ? 'text-purple-600' : 'text-gray-400',
          glow: achievement.isEarned ? 'ring-2 ring-purple-200' : ''
        };
      case 'uncommon':
        return {
          border: 'border-blue-400',
          bg: achievement.isEarned ? 'bg-gradient-to-br from-blue-50 to-cyan-50' : 'bg-gray-50',
          shadow: achievement.isEarned ? 'shadow-lg shadow-blue-200/50' : 'shadow-md',
          titleColor: achievement.isEarned ? 'text-blue-800' : 'text-gray-400',
          descColor: achievement.isEarned ? 'text-blue-600' : 'text-gray-400',
          glow: achievement.isEarned ? 'ring-2 ring-blue-200' : ''
        };
      default: // common
        return {
          border: 'border-green-400',
          bg: achievement.isEarned ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gray-50',
          shadow: achievement.isEarned ? 'shadow-lg shadow-green-200/50' : 'shadow-md',
          titleColor: achievement.isEarned ? 'text-green-800' : 'text-gray-400',
          descColor: achievement.isEarned ? 'text-green-600' : 'text-gray-400',
          glow: achievement.isEarned ? 'ring-2 ring-green-200' : ''
        };
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'attendance':
        return 'bg-green-100 text-green-800';
      case 'participation':
        return 'bg-purple-100 text-purple-800';
      case 'leadership':
        return 'bg-orange-100 text-orange-800';
      case 'special':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'Huyền thoại';
      case 'rare': return 'Hiếm';
      case 'uncommon': return 'Khá hiếm';
      case 'common': return 'Thường';
      default: return '';
    }
  };

  const getProgressPercentage = () => {
    if (!achievement.progress) return 0;
    return (achievement.progress.current / achievement.progress.target) * 100;
  };

  const sizeClasses = getSizeClasses();
  const rarityStyles = getRarityStyles(achievement.rarity);

  return (
    <div 
      className={`
        relative rounded-lg border-2 transition-all duration-300 hover:scale-105 cursor-pointer
        ${rarityStyles.border} ${rarityStyles.bg} ${rarityStyles.shadow} ${rarityStyles.glow}
        ${sizeClasses.container}
        ${!achievement.isEarned ? 'grayscale opacity-60' : ''}
      `}
    >
      {/* Rarity Indicator */}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyles(achievement.category)}`}>
          {getRarityLabel(achievement.rarity)}
        </span>
      </div>

      {/* Achievement Content */}
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`${sizeClasses.icon} mb-2 ${!achievement.isEarned ? 'filter grayscale' : ''}`}>
          {achievement.icon}
        </div>

        {/* Title */}
        <h3 className={`font-semibold ${sizeClasses.title} ${rarityStyles.titleColor} mb-1`}>
          {achievement.title}
        </h3>

        {/* Description */}
        <p className={`${sizeClasses.description} ${rarityStyles.descColor} mb-3 leading-relaxed`}>
          {achievement.description}
        </p>

        {/* Progress Bar (if not earned and has progress) */}
        {!achievement.isEarned && achievement.progress && showProgress && (
          <div className="w-full mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tiến độ</span>
              <span>{achievement.progress.current}/{achievement.progress.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getProgressPercentage().toFixed(1)}% hoàn thành
            </div>
          </div>
        )}

        {/* Earned Date */}
        {achievement.isEarned && achievement.earnedDate && (
          <div className="text-xs text-gray-500 mt-2">
            Đạt được: {new Date(achievement.earnedDate).toLocaleDateString('vi-VN')}
          </div>
        )}

        {/* Category Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryStyles(achievement.category)}`}>
          {achievement.category === 'academic' && '📚 Học tập'}
          {achievement.category === 'attendance' && '📅 Chuyên cần'}
          {achievement.category === 'participation' && '🙋 Tham gia'}
          {achievement.category === 'leadership' && '👑 Lãnh đạo'}
          {achievement.category === 'special' && '⭐ Đặc biệt'}
        </div>
      </div>

      {/* Shine Effect for Earned Achievements */}
      {achievement.isEarned && (
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform rotate-45 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

// Component hiển thị danh sách achievements
interface AchievementGridProps {
  achievements: Achievement[];
  filter?: 'all' | 'earned' | 'unearned';
  category?: Achievement['category'] | 'all';
}

export const AchievementGrid = ({ 
  achievements, 
  filter = 'all',
  category = 'all' 
}: AchievementGridProps) => {
  
  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'earned' && achievement.isEarned) ||
      (filter === 'unearned' && !achievement.isEarned);
    
    const matchesCategory = 
      category === 'all' || 
      achievement.category === category;
    
    return matchesFilter && matchesCategory;
  });

  const earnedCount = achievements.filter(a => a.isEarned).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Thành tích</h2>
            <p className="text-gray-600">Theo dõi quá trình học tập của bạn</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#1e1e2f]">
              {earnedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-500">Đã đạt được</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] h-2 rounded-full"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            showProgress={!achievement.isEarned}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Không có thành tích nào
          </h3>
          <p className="text-gray-500">
            Tiếp tục học tập để mở khóa những thành tích mới!
          </p>
        </div>
      )}
    </div>
  );
};