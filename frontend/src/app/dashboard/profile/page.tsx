import { UserProfileWithCourses } from '@/components/widgets/profile/UserProfileWithCourses';

export const metadata = {
  title: 'Hồ sơ cá nhân | Class Management System',
  description: 'Quản lý thông tin hồ sơ cá nhân và khóa học',
};

export default function ProfilePage() {
  return <UserProfileWithCourses />;
}